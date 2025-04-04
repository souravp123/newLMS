/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
	reactStrictMode: true,
	trailingSlash: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	optimizeFonts: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	env: {
		JWT_SECRET: "asdfghjklnbvcxzqwertyuiopmkioprewqasderfgnujm",
		EMAIL_USER: "info@ivydude.com",
		EMAIL_PASSWORD: "#igh$corE100",
		CLOUD_NAME: "dtzgnmchy",
		UPLOAD_PRESETS: "lms_image",
		CLOUDINARY_URL:
			"https://api.cloudinary.com/v1_1/dtzgnmchy/image/upload",
		CLOUDINARY_VIDEO_URL:
			"https://api.cloudinary.com/v1_1/dtzgnmchy/video/upload",
		CLOUDINARY_ZIP_URL:
			"https://api.cloudinary.com/v1_1/dtzgnmchy/raw",
		STRIPE_SECRET_KEY: "sk_test_51OE4GeSBF3VGBTiicVrLRUfxUAY8EQhTaWACTa2tQp5eqAxJmjbywFDUsCnzHVpDQLsHqyDrir7g7UpMSfifzJnc00TbhZEd6i",
		STRIPE_PUBLISHABLE_KEY: "pk_test_51OE4GeSBF3VGBTiis1615VXnKxd2QMihhIu39AeSOVKwxKu8xsLnJtTz4ZIzOIinPimR2XfTpZWg6YIQ0raDJWrU00i8Aakk9F",
		RZ_PAY_KEY_ID: "rzp_live_1fR5NlK36gp3Fv",
		RZ_PAY_SECRET_KEY: "UD6Bm4NplU7sIfVpWatfiooC",
		// RZ_PAY_KEY_ID: "rzp_test_FvLcfe89leeQQX",
		// RZ_PAY_SECRET_KEY: "jfNDJRqMJRr9Rvw9yzd46n0k"
	}
};

module.exports = nextConfig;
