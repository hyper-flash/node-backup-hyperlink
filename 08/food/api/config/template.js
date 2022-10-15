require("dotenv").config();
var exports=module.exports={};

// Verify Email mail template
exports.verifyEmail = function(result,callback)
{
    const template = `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title>${process.env.APP_NAME} - Verify Email</title>
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
      <style>
        html,
        body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
        }
    
        /* What it does: Stops email clients resizing small text. */
        * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
    
        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }
    
        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
        }
    
        /* What it does: Fixes webkit padding issue. */
        table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
        }
    
        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
          -ms-interpolation-mode: bicubic;
        }
    
        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
          text-decoration: none;
        }
    
        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
    
        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
          display: none !important;
          opacity: 0.01 !important;
        }
    
        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
          color: inherit !important;
        }
    
        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
          display: none !important;
        }
    
        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
    
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u~div .email-container {
            min-width: 320px !important;
          }
        }
    
        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u~div .email-container {
            min-width: 375px !important;
          }
        }
    
        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
          u~div .email-container {
            min-width: 414px !important;
          }
        }
      </style>
      <style>
        .primary {
          background: #272727;
        }
    
        .bg_white {
          background: #ffffff;
        }
    
        .bg_light {
          background: #222222;
        }
    
        .bg_black {
          background: #000000;
        }
    
        .bg_dark {
          background: rgba(0, 0, 0, .8);
        }
    
        .email-section {
          padding: 1.5em;
        }
    
        /*BUTTON*/
        .btn {
          padding: 10px 20px;
          display: inline-block;
        }
    
        .btn.btn-primary {
          border-radius: 5px;
          background: #7a4997;
          color: #ffffff;
        }
    
        .btn.btn-white {
          border-radius: 5px;
          background: #ffffff;
          color: #000000;
        }
    
        .btn.btn-white-outline {
          border-radius: 5px;
          background: transparent;
          border: 1px solid #fff;
          color: #fff;
          min-width: 50px;
        }
    
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Poppins', sans-serif;
          color: #000000;
          margin-top: 0;
        }
    
        body {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(0, 0, 0, .4);
        }
    
        a {
          color: #7a4997;
        }
    
        table {}
    
        /*LOGO*/
    
        .logo h1 {
          margin: 0;
        }
    
        .logo h1 a {
          color: #000000;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
        }
    
        .navigation {
          padding: 0;
        }
    
        .navigation li {
          list-style: none;
          display: inline-block;
          ;
          margin-left: 5px;
          font-size: 13px;
          font-weight: 500;
        }
    
        .navigation li a {
          color: rgba(0, 0, 0, .4);
        }
    
        /*HERO*/
        .hero {
          position: relative;
          z-index: 0;
        }
    
        .hero .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: '';
          width: 100%;
          background: #000000;
          z-index: -1;
          opacity: .3;
        }
    
        .hero .icon {}
    
        .hero .icon a {
          display: block;
          width: 60px;
          margin: 0 auto;
        }
    
        .hero .text {
          color: rgba(255, 255, 255, .8);
        }
    
        .hero .text h2 {
          color: #ffffff;
          font-size: 30px;
          margin-bottom: 0;
        }
    
    
        /*HEADING SECTION*/
        .heading-section {}
    
        .heading-section h2 {
          color: #000000;
          font-size: 20px;
          margin-top: 0;
          line-height: 1.4;
          font-weight: 700;
          text-transform: uppercase;
        }
    
        .heading-section .subheading {
          margin-bottom: 20px !important;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(0, 0, 0, .4);
          position: relative;
        }
    
        .heading-section .subheading::after {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          content: '';
          width: 100%;
          height: 2px;
          background: #0d0cb5;
          margin: 0 auto;
        }
    
        .heading-section-white {
          color: rgba(255, 255, 255, .8);
        }
    
        .heading-section-white h2 {
          font-family:
            line-height: 1;
          padding-bottom: 0;
        }
    
        .heading-section-white h2 {
          color: #ffffff;
        }
    
        .heading-section-white .subheading {
          margin-bottom: 0;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, .4);
        }
    
    
        .icon {
          text-align: center;
        }
    
        .icon img {}
    
    
        /*SERVICES*/
        .services {
          background: rgba(0, 0, 0, .03);
        }
    
        .text-services {
          padding: 10px 10px 0;
          text-align: center;
        }
    
        .text-services h3 {
          font-size: 16px;
          font-weight: 600;
        }
    
        .services-list {
          padding: 0;
          margin: 0 0 20px 0;
          width: 100%;
          float: left;
        }
    
        .services-list img {
          float: left;
        }
    
        .services-list .text {
          width: calc(100% - 60px);
          float: right;
        }
    
        .services-list h3 {
          margin-top: 0;
          margin-bottom: 0;
        }
    
        .services-list p {
          margin: 0;
        }
    
        
        .text-services .meta {
          text-transform: uppercase;
          font-size: 14px;
        }
    
        .text-testimony .name {
          margin: 0;
        }
    
        .text-testimony .position {
          color: rgba(0, 0, 0, .3);
    
        }
    
        .img {
          width: 100%;
          height: auto;
          position: relative;
        }
    
        .img .icon {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          bottom: 0;
          margin-top: -25px;
        }
    
        .img .icon a {
          display: block;
          width: 60px;
          position: absolute;
          top: 0;
          left: 50%;
          margin-left: -25px;
        }
        .counter {
          width: 100%;
          position: relative;
          z-index: 0;
        }
    
        .counter .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: '';
          width: 100%;
          background: #000000;
          z-index: -1;
          opacity: .3;
        }
    
        .counter-text {
          text-align: center;
        }
    
        .counter-text .num {
          display: block;
          color: #ffffff;
          font-size: 34px;
          font-weight: 700;
        }
    
        .counter-text .name {
          display: block;
          color: rgba(255, 255, 255, .9);
          font-size: 13px;
        }
    
        .footer {
          color: rgba(255, 255, 255, .5);
    
        }
    
        .footer .heading {
          color: #ffffff;
          font-size: 20px;
        }
    
        .footer ul {
          margin: 0;
          padding: 0;
        }
    
        .footer ul li {
          list-style: none;
          margin-bottom: 10px;
        }
    
        .footer ul li a {
          color: rgba(255, 255, 255, 1);
        }
        @media screen and (max-width: 500px) {
          .icon {
            text-align: left;
          }
          .text-services {
            padding-left: 0;
            padding-right: 20px;
            text-align: left;
          }
        }
      </style>
    </head>
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
      <center style="width: 100%; background-color: #000000;">
        <div
          style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
          <!-- BEGIN BODY -->
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="top" class="bg_light">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="100%" class="logo" style="text-align: center;">
                      <h1><a href="#" style="display: block;"><img src="${IMGCONST.HEYKRAY_LOGO}"
                            style="width: 18%; margin-top: 0;"></a></h1>
                    </td>
    
                  </tr>
                </table>
              </td>
            </tr><!-- end tr -->
            <tr>
              <td valign="middle" class="hero bg_white"
                style="background-image: url(${IMGCONST.MIC_IMAGE}); background-size: cover; height: 250px;">
                <div class="overlay"></div>
                <table>
                  <tr>
                    <td>
                      <div class="text" style="padding: 0 3em; text-align: center;">
                        <h2>Welcome ${result.full_name}!</h2>
                        <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr><!-- end tr -->
            <tr>
              <td class="bg_white">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="bg_white" style="padding: 50px 50px 30px">
                      <div class="heading-section" style="text-align: center; padding: 0 30px;">
                        <a href="${IMGCONST.VERIFY_EMAIL}${result.encoded_user_id}" class="btn btn-primary">Confirm Account</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg_white email-section">
                      <div class="heading-section" style="text-align: left; padding: 0 30px;">
                        <p style="margin: 0 0 1em;">If that doesn't work, copy and paste the following
                          link in your browser:</p>
                        <p><a href="${IMGCONST.UNSUBSCRIBE}${result.encoded_user_id}">${IMGCONST.UNSUBSCRIBE}${result.encoded_user_id}</a></p>
                        <p style="margin: 0;">If you have any questions, just reply to this email—we're
                          always happy to help out.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg_white email-section">
                      <div class="heading-section" style="text-align: left; padding: 0 30px;">
                        <p style="margin: 0;">Cheers,</p>
                        <p style="margin: 0;">Trainingsession Team</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="primary email-section" style="text-align:center;">
                      <div class="heading-section heading-section-white">
                        <h2>OUR APPS!</h2>
                        <p>Trainingsession is now available on Android & iOS both platforms. Please install our application to enjoy amazing experience.</p>
                        <p><a href="#" class="btn btn-white-outline">Android</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" class="btn btn-white-outline">iOS</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="middle" class="bg_black footer email-section">
                <table>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-right: 10px;">
                            <p>&copy; 2022 Trainingsession. All Rights Reserved</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-left: 5px; padding-right: 5px;">
                            <p style="color: rgba(255,255,255,.4);">You received this email because
                              you just signed up for a new account. If you don't want to receive these emails click here to unsubscribe.</p>
                            <p><a href="${IMGCONST.UNSUBSCRIBE}${result.encoded_user_id}" style="color: rgba(76, 0, 255, 0.4);">Unsubscribe</a></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
    </html>
    `;
    callback(template);
}

// forgot password mail template
exports.forgot_password = function(result,callback)
{
    const template = `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title>${process.env.APP_NAME} - Forgot Password</title>
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
      <style>
        html,
        body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
        }
    
        /* What it does: Stops email clients resizing small text. */
        * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
    
        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }
    
        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
        }
    
        /* What it does: Fixes webkit padding issue. */
        table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
        }
    
        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
          -ms-interpolation-mode: bicubic;
        }
    
        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
          text-decoration: none;
        }
    
        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
    
        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
          display: none !important;
          opacity: 0.01 !important;
        }
    
        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
          color: inherit !important;
        }
    
        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
          display: none !important;
        }
    
        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
    
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u~div .email-container {
            min-width: 320px !important;
          }
        }
    
        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u~div .email-container {
            min-width: 375px !important;
          }
        }
    
        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
          u~div .email-container {
            min-width: 414px !important;
          }
        }
      </style>
      <style>
        .primary {
          background: #272727;
        }
    
        .bg_white {
          background: #ffffff;
        }
    
        .bg_light {
          background: #222222;
        }
    
        .bg_black {
          background: #000000;
        }
    
        .bg_dark {
          background: rgba(0, 0, 0, .8);
        }
    
        .email-section {
          padding: 2.5em;
        }
    
        /*BUTTON*/
        .btn {
          padding: 10px 20px;
          display: inline-block;
        }
    
        .btn.btn-primary {
          border-radius: 5px;
          background: #7a4997;
          color: #ffffff;
        }
    
        .btn.btn-white {
          border-radius: 5px;
          background: #ffffff;
          color: #000000;
        }
    
        .btn.btn-white-outline {
          border-radius: 5px;
          background: transparent;
          border: 1px solid #fff;
          color: #fff;
          min-width: 50px;
        }
    
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Poppins', sans-serif;
          color: #000000;
          margin-top: 0;
        }
    
        body {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(0, 0, 0, .4);
        }
    
        a {
          color: #7a4997;
        }
    
        table {}
    
        /*LOGO*/
    
        .logo h1 {
          margin: 0;
        }
    
        .logo h1 a {
          color: #000000;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
        }
    
        .navigation {
          padding: 0;
        }
    
        .navigation li {
          list-style: none;
          display: inline-block;
          ;
          margin-left: 5px;
          font-size: 13px;
          font-weight: 500;
        }
    
        .navigation li a {
          color: rgba(0, 0, 0, .4);
        }
    
        /*HERO*/
        .hero {
          position: relative;
          z-index: 0;
        }
    
        .hero .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: '';
          width: 100%;
          background: #000000;
          z-index: -1;
          opacity: .3;
        }
    
        .hero .icon {}
    
        .hero .icon a {
          display: block;
          width: 60px;
          margin: 0 auto;
        }
    
        .hero .text {
          color: rgba(255, 255, 255, .8);
        }
    
        .hero .text h2 {
          color: #ffffff;
          font-size: 30px;
          margin-bottom: 0;
        }
    
    
        /*HEADING SECTION*/
        .heading-section {}
    
        .heading-section h2 {
          color: #000000;
          font-size: 20px;
          margin-top: 0;
          line-height: 1.4;
          font-weight: 700;
          text-transform: uppercase;
        }
    
        .heading-section .subheading {
          margin-bottom: 20px !important;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(0, 0, 0, .4);
          position: relative;
        }
    
        .heading-section .subheading::after {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          content: '';
          width: 100%;
          height: 2px;
          background: #0d0cb5;
          margin: 0 auto;
        }
    
        .heading-section-white {
          color: rgba(255, 255, 255, .8);
        }
    
        .heading-section-white h2 {
          font-family:
            line-height: 1;
          padding-bottom: 0;
        }
    
        .heading-section-white h2 {
          color: #ffffff;
        }
    
        .heading-section-white .subheading {
          margin-bottom: 0;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, .4);
        }
    
    
        .icon {
          text-align: center;
        }
    
        .icon img {}
    
    
        /*SERVICES*/
        .services {
          background: rgba(0, 0, 0, .03);
        }
    
        .text-services {
          padding: 10px 10px 0;
          text-align: center;
        }
    
        .text-services h3 {
          font-size: 16px;
          font-weight: 600;
        }
    
        .services-list {
          padding: 0;
          margin: 0 0 20px 0;
          width: 100%;
          float: left;
        }
    
        .services-list img {
          float: left;
        }
    
        .services-list .text {
          width: calc(100% - 60px);
          float: right;
        }
    
        .services-list h3 {
          margin-top: 0;
          margin-bottom: 0;
        }
    
        .services-list p {
          margin: 0;
        }
    
        /*BLOG*/
        .text-services .meta {
          text-transform: uppercase;
          font-size: 14px;
        }
    
        /*TESTIMONY*/
        .text-testimony .name {
          margin: 0;
        }
    
        .text-testimony .position {
          color: rgba(0, 0, 0, .3);
    
        }
    
    
        /*VIDEO*/
        .img {
          width: 100%;
          height: auto;
          position: relative;
        }
    
        .img .icon {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          bottom: 0;
          margin-top: -25px;
        }
    
        .img .icon a {
          display: block;
          width: 60px;
          position: absolute;
          top: 0;
          left: 50%;
          margin-left: -25px;
        }
    
    
    
        /*COUNTER*/
        .counter {
          width: 100%;
          position: relative;
          z-index: 0;
        }
    
        .counter .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: '';
          width: 100%;
          background: #000000;
          z-index: -1;
          opacity: .3;
        }
    
        .counter-text {
          text-align: center;
        }
    
        .counter-text .num {
          display: block;
          color: #ffffff;
          font-size: 34px;
          font-weight: 700;
        }
    
        .counter-text .name {
          display: block;
          color: rgba(255, 255, 255, .9);
          font-size: 13px;
        }
    
    
        /*FOOTER*/
    
        .footer {
          color: rgba(255, 255, 255, .5);
    
        }
    
        .footer .heading {
          color: #ffffff;
          font-size: 20px;
        }
    
        .footer ul {
          margin: 0;
          padding: 0;
        }
    
        .footer ul li {
          list-style: none;
          margin-bottom: 10px;
        }
    
        .footer ul li a {
          color: rgba(255, 255, 255, 1);
        }
    
    
        @media screen and (max-width: 500px) {
    
          .icon {
            text-align: left;
          }
    
          .text-services {
            padding-left: 0;
            padding-right: 20px;
            text-align: left;
          }
    
        }
      </style>
    </head>
    
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
      <center style="width: 100%; background-color: #000000;">
        <div
          style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
          <!-- BEGIN BODY -->
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="top" class="bg_light">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="100%" class="logo" style="text-align: center;">
                      <h1><a href="#" style="display: block;"><img src=""
                            style="width: 18%; margin-top: 0;"></a></h1>
                    </td>
    
                  </tr>
                </table>
              </td>
            </tr><!-- end tr -->
            <tr>
              <td valign="middle" class="hero bg_white"
                style="background-image: url(); background-size: cover; height: 300px;">
                <div class="overlay"></div>
                <table>
                  <tr>
                    <td>
                      <div class="text" style="padding: 0 3em; text-align: center;">
                        <h2>Hey ${result.full_name}!</h2>
                        <p>Trouble signing in? We are here to help you!</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr><!-- end tr -->
            <tr>
              <td class="bg_white">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="bg_white email-section">
                      <div class="heading-section" style="text-align: left; padding: 0 30px;">
                        <p style="margin: 0 0 1em;">Resetting your password is easy. Just press the
                          button below and follow the instructions. We'll have you up and running in
                          no time.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg_white" style="padding: 0 50px 30px">
                      <div class="heading-section" style="text-align: center; padding: 0 30px;">
                        <a href="${result.encoded_user_id}" class="btn btn-primary">Reset Password</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="bg_white email-section">
                      <div class="heading-section" style="text-align: left; padding: 0 30px;">
                        <p style="margin: 0;">Cheers,</p>
                        <p style="margin: 0;">Trainingsession Team</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="primary email-section" style="text-align:center;">
                      <div class="heading-section heading-section-white">
                        <h2>OUR APPS!</h2>
                        <p>Trainingsession is now available on Android & iOS both platforms. Please install our application to enjoy amazing experience.</p>
                        <p><a href="#" class="btn btn-white-outline">Android</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" class="btn btn-white-outline">iOS</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
    
              </td>
            </tr><!-- end:tr -->
            <!-- 1 Column Text + Button : END -->
          </table>
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="middle" class="bg_black footer email-section">
                <table>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-right: 10px;">
                            <p>&copy; 2022 Trainingsession. All Rights Reserved</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-left: 5px; padding-right: 5px;">
                            <p style="color: rgba(255,255,255,.4);">You received this email because
                              you just signed up for a new account. If you don't want to receive these emails click here to unsubscribe.</p>
                            <p><a href="${result.encoded_user_id}" style="color: rgb(147, 10, 181);">Unsubscribe</a></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
    
    </html>
    `;
    callback(template);
}

// Contact Us mail template
exports.contactus = function(result,callback)
{
    const template = `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <meta charset="utf-8"> <!-- utf-8 works for most cases -->
      <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
      <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
      <title>${process.env.APP_NAME} - Contact Us</title> <!-- The title tag shows in email notifications, like Android 4.4. -->
    
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
      <style>
        /* What it does: Remove spaces around the email design added by some email clients. */
        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        html,
        body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
        }
    
        /* What it does: Stops email clients resizing small text. */
        * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
    
        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }
    
        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
        }
    
        /* What it does: Fixes webkit padding issue. */
        table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
        }
    
        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
          -ms-interpolation-mode: bicubic;
        }
    
        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
          text-decoration: none;
        }
    
        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
    
        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
          display: none !important;
          opacity: 0.01 !important;
        }
    
        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
          color: inherit !important;
        }
    
        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
          display: none !important;
        }
    
        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
    
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u~div .email-container {
            min-width: 320px !important;
          }
        }
    
        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u~div .email-container {
            min-width: 375px !important;
          }
        }
    
        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
          u~div .email-container {
            min-width: 414px !important;
          }
        }
      </style>
      <style>
        .primary {
          background: #30e3ca;
        }
    
        .bg_white {
          background: #ffffff;
        }
    
        .bg_light {
          background: #222222;
        }
    
        .bg_black {
          background: #000000;
        }
    
        .bg_dark {
          background: rgba(0, 0, 0, .8);
        }
    
        .email-section {
          padding: 2.5em;
        }
    
        /*BUTTON*/
        .btn {
          padding: 10px 15px;
          display: inline-block;
        }
    
        .btn.btn-primary {
          border-radius: 5px;
          background: #7a4997;
          color: #ffffff;
        }
    
        .btn.btn-white {
          border-radius: 5px;
          background: #ffffff;
          color: #000000;
        }
    
        .btn.btn-white-outline {
          border-radius: 5px;
          background: transparent;
          border: 1px solid #fff;
          color: #fff;
        }
    
        .btn.btn-black-outline {
          border-radius: 0px;
          background: transparent;
          border: 2px solid #000;
          color: #000;
          font-weight: 700;
        }
    
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Lato', sans-serif;
          color: #000000;
          margin-top: 0;
          font-weight: 400;
        }
    
        body {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(0, 0, 0, .4);
        }
    
        a {
          color: #7a4997;
        }
    
        table {}
    
        /*LOGO*/
    
        .logo h1 {
          margin: 0;
        }
    
        .logo h1 a {
          color: #30e3ca;
          font-size: 24px;
          font-weight: 700;
          font-family: 'Lato', sans-serif;
        }
    
        /*HERO*/
        .hero {
          position: relative;
          z-index: 0;
        }
    
        .hero .text {
          color: rgba(0, 0, 0, .3);
        }
    
        .hero .text h2 {
          color: rgb(255, 255, 255);
          font-size: 40px;
          margin-bottom: 0;
          font-weight: 400;
          line-height: 1.4;
        }
    
        .hero .text h3 {
          font-size: 24px;
          font-weight: 300;
        }
    
        .hero .text h2 span {
          font-weight: 600;
          color: #30e3ca;
        }
    
    
        /*HEADING SECTION*/
        .heading-section {}
    
        .heading-section h2 {
          color: #000000;
          font-size: 28px;
          margin-top: 0;
          line-height: 1.4;
          font-weight: 400;
        }
    
        .heading-section .subheading {
          margin-bottom: 20px !important;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(0, 0, 0, .4);
          position: relative;
        }
    
        .heading-section .subheading::after {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          content: '';
          width: 100%;
          height: 2px;
          background: #30e3ca;
          margin: 0 auto;
        }
    
        .heading-section-white {
          color: rgba(255, 255, 255, .8);
        }
    
        .heading-section-white h2 {
          font-family:
            line-height: 1;
          padding-bottom: 0;
        }
    
        .heading-section-white h2 {
          color: #ffffff;
        }
    
        .heading-section-white .subheading {
          margin-bottom: 0;
          display: inline-block;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, .4);
        }
    
    
        ul.social {
          padding: 0;
        }
    
        ul.social li {
          display: inline-block;
          margin-right: 10px;
        }
    
        /*FOOTER*/
    
        .footer {
          border-top: 1px solid rgba(0, 0, 0, .05);
          color: rgba(255, 255, 255, .5);
        }
    
        .footer .heading {
          color: #000;
          font-size: 20px;
        }
    
        .footer ul {
          margin: 0;
          padding: 0;
        }
    
        .footer ul li {
          list-style: none;
          margin-bottom: 10px;
        }
    
        .footer ul li a {
          color: rgba(0, 0, 0, 1);
        }
    
    
        @media screen and (max-width: 500px) {}
      </style>
    </head>
    
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
      <center style="width: 100%; background-color: #000000;">
        <div
          style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
          <!-- BEGIN BODY -->
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="top" class="bg_light" style="padding: 1em 2.5em 0 2.5em;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="logo" style="text-align: center;">
                      <h1><a href="#"><img src=""
                            style="width: 18%; margin-top: 0;"></a></h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr><!-- end tr -->
            <tr>
              <td valign="middle" class="hero bg_light" style="padding: 3em 0 2em 0;">
                <img src="" alt=""
                  style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
              </td>
            </tr><!-- end tr -->
            <tr>
              <td valign="middle" class="hero bg_light" style="padding: 2em 0 4em 0;">
                <table>
                  <tr>
                    <td>
                      <div class="text" style="padding: 0 2.5em; text-align: center;">
                        <h2 style="#ffffff">Hey ${result.full_name}!</h2>
                        <p style="color: #ffffff;">Thank you for contacting Support at ${process.env.APP_NAME}!</p>
                        <p style="color: #ffffff;">Please bear with us, it may take a few days to get back to you. Rest assured we will respond to your email as soon as possible.</p>
                        <p style="color: #ffffff;">Thank you for your patience and understanding.</p>
                        <p><a href="" class="btn btn-primary">Get in touch</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="margin: auto;">
            <tr>
              <td valign="middle" class="bg_black footer email-section">
                <table>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-right: 10px;">
                            <p>&copy; 2022 Trainingsession. All Rights Reserved</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" width="100%">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-left: 5px; padding-right: 5px;">
                            <p style="color: rgba(255,255,255,.4);">You received this email because
                              you just signed up for a new account. If you don't want to receive these emails click here to unsubscribe.</p>
                            <p><a href="${result.encoded_user_id}" style="color: #7a4997;">Unsubscribe</a></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
    </html>
    `;
    callback(template);
}