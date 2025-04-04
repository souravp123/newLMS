import cookie from "js-cookie";
import Router from "next/router";


export const handleLogin = (t, routeNext, data) => {
	cookie.set("edmy_users_token", t);
	if (routeNext.query && routeNext.query.next) {
		Router.push(routeNext.query.next);
	} else if (data.isAdmin) {
		Router.push("/admin");
	} else if (data.isInstructor) {
		Router.push("/instructor/courses/");
	} else {
		Router.push("/learning/my-courses?initial=true")
	} 
};


export const handleLogout = () => {
	cookie.remove("edmy_users_token");
	Router.push("/");
};

export const destroyCookie = () => {
	cookie.remove("edmy_users_token");
	Router.reload("/");
};

export const redirectUser = (ctx, location) => {
	if (ctx.req) {
		ctx.res.writeHead(302, { Location: location });
		ctx.res.end();
	} else {
		Router.push({ pathname: location, query: { next: ctx.pathname } });
	}
};

export const slugify = (string) => {
	return string
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};
