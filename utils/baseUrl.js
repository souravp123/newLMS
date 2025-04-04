const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://www.ivydude.com"
		// ? "http://195.35.6.94:3000"
		: "http://localhost:3000";

export default baseUrl;
