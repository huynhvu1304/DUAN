<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign Up Form by Colorlib</title>
    <!-- Font Icon -->
    <link rel="stylesheet" href="public/auth/fonts/material-icon/css/material-design-iconic-font.min.css">
    <!-- Main css -->
    <link rel="stylesheet" href="public/auth/css/style.css">
</head>
<body>

    <div class="main">

        <!-- Sign up form -->
        <section class="signup">
            <div class="container">
                <div class="signup-content">
                    <div class="signup-form">
                        <h2 class="form-title" style="font-family: sans-serif;">Đăng kí</h2>
                        <form method="POST" action="postregister" class="register-form" id="register-form">
                            <div class="form-group">
                                <label for="name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="name" id="name" placeholder="Your User Name" value="<?= $_POST['name'] ?? ""?>" />
                            </div>
                            <div class="form-group">
                                <label for="phone"><i class="zmdi zmdi-phone material-icons-name"></i></label>
                                <input type="phone" name="phone" id="phone" placeholder="Your Phone" value="<?= $_POST['phone'] ?? ""?>"/>
                            </div>
                            <div class="form-group">
                                <label for="email"><i class="zmdi zmdi-email"></i></label>
                                <input type="email" name="email" id="email" placeholder="Your Email" value="<?= $_POST['email'] ?? ""?>"/>
                            </div>
                            <div class="form-group">
                                <label for="pass"><i class="zmdi zmdi-lock"></i></label>
                                <input type="password" name="pass" id="pass" placeholder="Password" value="<?= $_POST['pass'] ?? ""?>"/>
                            </div>
                            <div class="form-group">
                                <label for="re-pass"><i class="zmdi zmdi-lock-outline"></i></label>
                                <input type="password" name="re_pass" id="re_pass" placeholder="Repeat your password"/>
                            </div>                            
                            <div class="form-group">
                            <?php if(isset($errors) && count($errors)>0){?>
                            <ul>
                                <?php foreach($errors as $error){?>
                                    <li style="color:red">                                      
                                            <?php echo $error?>                                       
                                    </li>
                                <?php }?>
                            </ul>  
                            <?php }?>                            
                            </div>
                            <div class="form-group form-button">
                                <input type="submit" name="signup" id="signup" class="form-submit" value="Đăng kí" style="font-family: sans-serif;"/>
                            </div>
                        </form>
                    </div>
                    <div class="signup-image">
                        <figure><img src="public/auth/images/signup-image.jpg" alt="sing up image"></figure>
                        <a href="<?=$baseurl?>/login" class="signup-image-link" style="font-family: sans-serif;">Tôi đã có tài khoản</a>
                        <a href="<?=$baseurl?>" class="signup-image-link">Trở về trang chủ</a>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- JS -->
    <script src="public/auth/vendor/jquery/jquery.min.js"></script>
    <script src="public/auth/js/main.js"></script>
</body><!-- This templates was made by Colorlib (https://colorlib.com) -->
</html>