<script>
  import { onMount } from 'svelte';
  
  export let mode;
  export let onLogin;

  let showOTP = false;
  let otp = '';
  let tempAuthData = {};
  let formData = {
    login: '',
    phone: '',
    password: '',
    remember: false
  };

  let otpDigits = ['', '', '', ''];
  let forgotPasswordMode = false;
  let newPassword = '';
  let confirmNewPassword = '';
  let passwordResetStep = 1;

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (forgotPasswordMode) {
      handlePasswordReset();
      return;
    }
    
    if (!showOTP) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      if (mode === 'register') {
        const userExists = users.find(u => u.login === formData.login || u.phone === formData.phone);
        if (userExists) {
          alert('User with this login or phone number already exists.');
          return;
        }
      } else {
        const user = users.find(u => u.phone === formData.phone && u.password === formData.password);
        if (!user) {
          alert('Incorrect phone number or password.');
          return;
        }
      }

      otp = generateOTP();
      tempAuthData = {
        mode,
        login: formData.login,
        phone: formData.phone,
        password: formData.password
      };
      
      alert(`Demo: OTP code sent to ${formData.phone}. Code: ${otp}`);
      showOTP = true;
    } else {
      const enteredOTP = otpDigits.join('');
      
      if (enteredOTP !== otp) {
        alert('Incorrect verification code');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      if (tempAuthData.mode === 'register') {
        users.push({
          login: tempAuthData.login,
          phone: tempAuthData.phone,
          password: tempAuthData.password
        });
        localStorage.setItem('users', JSON.stringify(users));
      }

      if (tempAuthData.mode === 'login' && formData.remember) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          phone: tempAuthData.phone,
          password: tempAuthData.password
        }));
      }

      onLogin(tempAuthData.login || users.find(u => u.phone === tempAuthData.phone).login);
    }
  }

  function handlePasswordReset() {
    if (passwordResetStep === 1) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.phone === formData.phone);
      
      if (!user) {
        alert('No user found with this phone number.');
        return;
      }
      
      otp = generateOTP();
      tempAuthData = {
        phone: formData.phone
      };
      
      alert(`Demo: Password reset OTP code sent to ${formData.phone}. Code: ${otp}`);
      passwordResetStep = 2;
      otpDigits = ['', '', '', ''];
    } else if (passwordResetStep === 2) {
      const enteredOTP = otpDigits.join('');
      
      if (enteredOTP !== otp) {
        alert('Incorrect verification code');
        return;
      }
      
      passwordResetStep = 3;
      newPassword = '';
      confirmNewPassword = '';
    } else if (passwordResetStep === 3) {
      if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (!newPassword || !confirmNewPassword) {
        alert('Please enter and confirm your new password');
        return;
      }
        
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.phone === tempAuthData.phone);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        forgotPasswordMode = false;
        showOTP = false;
        passwordResetStep = 1;
        newPassword = '';
        confirmNewPassword = '';
        otpDigits = ['', '', '', ''];
        
        alert('Password changed successfully! You can now login with your new password.');
        mode = 'login';
      }
    }
  }

  function resendOTP() {
    otp = generateOTP();
    alert(`Demo: New OTP code sent. Code: ${otp}`);
  }

  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    showOTP = false;
    forgotPasswordMode = false;
    passwordResetStep = 1;
    formData.login = '';
    formData.phone = '';
    formData.password = '';
    otpDigits = ['', '', '', ''];
    newPassword = '';
    confirmNewPassword = '';
  }

  function handleOTPInput(e, index) {
    const value = e.target.value;
    otpDigits[index] = value;
    if (value.length === 1 && index < 3) {
      document.getElementById(`otp${index+1}`).focus();
    }
  }

  function handleOTPKeyDown(e, index) {
    if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
      document.getElementById(`otp${index-1}`).focus();
    }
  }

  function startPasswordRecovery() {
    forgotPasswordMode = true;
    passwordResetStep = 1;
    showOTP = false;
    formData.password = '';
    otpDigits = ['', '', '', ''];
    newPassword = '';
    confirmNewPassword = '';
  }

  function cancelPasswordRecovery() {
    forgotPasswordMode = false;
    passwordResetStep = 1;
    showOTP = false;
    otpDigits = ['', '', '', ''];
    newPassword = '';
    confirmNewPassword = '';
  }

  onMount(() => {
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (rememberedUser && mode === 'login') {
      formData.phone = rememberedUser.phone;
      formData.password = rememberedUser.password;
      formData.remember = true;
    }
  });
</script>

<div class="auth-wrapper">
  <div class="auth-container">
    <h2>
      {#if forgotPasswordMode}
        {passwordResetStep === 1 && 'Password Recovery'}
        {passwordResetStep === 2 && 'Verify Code'}
        {passwordResetStep === 3 && 'New Password'}
      {:else}
        {mode === 'login' ? 'Login' : 'Register'}
      {/if}
    </h2>
    <form on:submit={handleSubmit}>
      {#if !forgotPasswordMode}
        {#if mode === 'register'}
          <input
            type="text"
            placeholder="Username"
            bind:value={formData.login}
            required
          />
        {/if}
        
        <input
          type="tel"
          placeholder="Phone number"
          bind:value={formData.phone}
          required
        />
        
        {#if !showOTP}
          <input
            type="password"
            placeholder="Password"
            bind:value={formData.password}
            required
          />
        {/if}
      {:else}
        {#if passwordResetStep === 1}
          <p>Enter your phone number to receive a verification code</p>
          <input
            type="tel"
            placeholder="Phone number"
            bind:value={formData.phone}
            required
          />
        {/if}
        
        {#if passwordResetStep === 2}
          <p>Enter the verification code sent to your phone</p>
          <div class="otp-container">
            {#each { length: 4 } as _, i}
              <input
                type="text"
                class="otp-input"
                maxlength="1"
                id="otp{i}"
                bind:value={otpDigits[i]}
                on:input={(e) => handleOTPInput(e, i)}
                on:keydown={(e) => handleOTPKeyDown(e, i)}
              />
            {/each}
          </div>
          <button type="button" class="link-button" on:click={resendOTP}>Resend code</button>
        {/if}
        
        {#if passwordResetStep === 3}
          <p>Enter and confirm your new password</p>
          <input
            type="password"
            placeholder="New Password"
            bind:value={newPassword}
            required
          />
          
          <input
            type="password"
            placeholder="Confirm New Password"
            bind:value={confirmNewPassword}
            required
          />
        {/if}
      {/if}
      
      {#if showOTP && !forgotPasswordMode}
        <div class="otp-container">
          <p>Enter SMS code:</p>
          {#each { length: 4 } as _, i}
            <input
              type="text"
              class="otp-input"
              maxlength="1"
              id="otp{i}"
              bind:value={otpDigits[i]}
              on:input={(e) => handleOTPInput(e, i)}
              on:keydown={(e) => handleOTPKeyDown(e, i)}
            />
          {/each}
          <button type="button" on:click={resendOTP}>Resend code</button>
        </div>
      {/if}
      
      {#if mode === 'login' && !forgotPasswordMode}
        <label class="remember">
          <input type="checkbox" bind:checked={formData.remember} /> Remember me
        </label>
      {/if}
      
      <button type="submit">
        {#if forgotPasswordMode}
          {passwordResetStep === 1 && 'Send Code'}
          {passwordResetStep === 2 && 'Verify Code'}
          {passwordResetStep === 3 && 'Change Password'}
        {:else}
          {showOTP ? 'Confirm' : mode === 'login' ? 'Login' : 'Register'}
        {/if}
      </button>
      
      {#if forgotPasswordMode}
        <button type="button" class="link-button" on:click={cancelPasswordRecovery}>
          Back to Login
        </button>
      {:else if mode === 'login'}
        <p>
          <button type="button" class="link-button" on:click={startPasswordRecovery}>
            Forgot password?
          </button>
        </p>
      {/if}
      
      {#if !forgotPasswordMode}
        <p>
          {mode === 'login' ? 'No account?' : 'Already have an account?'}
          <button type="button" class="link-button" on:click={switchMode}>
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      {/if}
    </form>
  </div>
</div>

<style>
  .auth-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to bottom right, #121212, #1a1a1a);
  }
  
  .auth-container {
    background: #1e1e1e;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .auth-container h2 {
    margin-bottom: 20px;
    color: #3b82f6;
  }
  
  .auth-container input[type="text"],
  .auth-container input[type="tel"],
  .auth-container input[type="password"] {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: none;
    border-radius: 6px;
    background: #2c2c2c;
    color: white;
  }
  
  .auth-container input::placeholder {
    color: #aaa;
  }
  
  .auth-container button {
    width: 100%;
    padding: 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
  }
  
  .auth-container button:hover {
    background-color: #2563eb;
  }
  
  .auth-container p {
    margin-top: 10px;
    font-size: 14px;
    color: #aaa;
  }
  
  .link-button {
    color: #3b82f6;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
  }

  .link-button:hover {
    text-decoration: underline;
  }
  
  .remember {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 0;
    font-size: 14px;
    color: #aaa;
  }
  
  .otp-container {
    margin-top: 10px;
  }
  
  .otp-input {
    width: 30px;
    height: 30px;
    text-align: center;
    margin: 0 5px;
    background: #2c2c2c;
    border: none;
    border-radius: 4px;
    color: white;
  }
</style>