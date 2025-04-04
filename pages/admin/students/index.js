import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import Link from "next/link";
import Footer from "@/components/_App/Footer";
import AdminSideNav from "@/components/_App/AdminSideNav";
import StudentsRaw from "@/components/Admin/StudentsRaw";
import toast from "react-hot-toast";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import GeneralLoader from "@/utils/GeneralLoader";
import { parseCookies } from "nookies";

const Index = ({ user }) => {
	const { edmy_users_token } = parseCookies();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState()
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState("");
	const [courseExpired, setCourseExpired] = useState(false);



	const fetchData = async () => {
		setLoading(true);
		try {
			const payload = {
				headers: { Authorization: edmy_users_token },
			};
			const response = await axios.get(`${baseUrl}/api/students`, payload);
			const courseResponse = await axios.get(`${baseUrl}/api/admin/courses`, payload);


			let students = response.data.students;

			setUsers(response.data.students);
			setCourses(courseResponse.data.courses);
			setLoading(false);
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message, {
				style: {
					border: "1px solid #ff0033",
					padding: "16px",
					color: "#ff0033",
				},
				iconTheme: {
					primary: "#ff0033",
					secondary: "#FFFAEE",
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchFilteredData = async (courseTitle) => {
		setLoading(true);
		try {
			const payload = {
				headers: { Authorization: edmy_users_token },
			};

			const filterResponse = await axios.get(`${baseUrl}/api/admin/filter-student`, {
				headers: payload.headers,
				params: { courseTitle },
			});
			// setUsers(response.data.students);
			setUsers(filterResponse.data.students || []);
			setLoading(false);
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message, {
				style: {
					border: "1px solid #ff0033",
					padding: "16px",
					color: "#ff0033",
				},
				iconTheme: {
					primary: "#ff0033",
					secondary: "#FFFAEE",
				},
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);



	const handleAdmin = async (userId) => {
		try {
			const payload = {
				headers: { Authorization: edmy_users_token },
			};

			const payloadData = { userId, admin: true };
			const response = await axios.put(
				`${baseUrl}/api/admin/make-admin`,
				payloadData,
				payload
			);
			toast.success(response.data.message, {
				style: {
					border: "1px solid #4BB543",
					padding: "16px",
					color: "#4BB543",
				},
				iconTheme: {
					primary: "#4BB543",
					secondary: "#FFFAEE",
				},
			});
			fetchData();
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message, {
				style: {
					border: "1px solid #ff0033",
					padding: "16px",
					color: "#ff0033",
				},
				iconTheme: {
					primary: "#ff0033",
					secondary: "#FFFAEE",
				},
			});
		} finally {
			setLoading(false);
			fetchData();
		}
	};

	
	const handleCourseSelect = (courseTitle) => {
		setSelectedCourse(courseTitle);
		if (courseTitle) {
			fetchFilteredData(courseTitle);
		} else {
			fetchData();
		}
	};

	return (
		<>
			<Navbar user={user} />

			<div className="main-content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-3 col-md-4">
							<AdminSideNav user={user} />
						</div>

						<div className="col-lg-9 col-md-8">
							<div className="main-content-box">
								<ul className="nav-style1">
									<li>
										<Link href="/admin/students/">
											<a className="active">Students</a>
										</Link>
									</li>
									<li>
										<Link href="/admin/students/site-admins/">
											<a>Admins</a>
										</Link>
									</li>
									
								</ul>

								<div className="filter-form">
									<div className="row mb-4">
										<div className="col-md-6">
											<select
												className="form-control"
												value={selectedCourse}
												onChange={(e) => handleCourseSelect(e.target.value)}
											>
												<option value="">Filter by Course</option>
												{courses.map((course) => (
													<option key={course.id} value={course.title}>
														{course.title}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>

								{loading ? (
									<GeneralLoader />
								) : (
									<div className="table-responsive">
										<table className="table align-middle table-hover fs-14">
											<thead>
												<tr>
													<th scope="col">Name</th>
													<th scope="col">Email</th>
													<th scope="col">Phone</th>
													<th scope="col">Level</th>
													<th scope="col">Email Confirmed</th>
													<th scope="col">Text</th>
												</tr>
											</thead>
											<tbody>
												{users.length > 0 ? (
													users.map((user) => (
														<StudentsRaw
															key={user.id}
															{...user}
															studentLevel={user.studentLevel}
														// students={students}
														// onAdmin={() => handleAdmin(user.id)}
														/>
													))
												) : (
													<tr>
														<td colSpan="7" className="text-center py-3">
															empty
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								)}

								{/* Pagination */}
								{/* <div className="col-lg-12 col-md-12">
									<div className="pagination-area text-center m-3">
										<a
											href="#"
											className="prev page-numbers"
										>
											<i className="bx bx-chevrons-left"></i>
										</a>
										<span
											className="page-numbers current"
											aria-current="page"
										>
											1
										</span>
										<a href="#" className="page-numbers">
											2
										</a>
										<a href="#" className="page-numbers">
											3
										</a>
										<a href="#" className="page-numbers">
											4
										</a>
										<a
											href="#"
											className="next page-numbers"
										>
											<i className="bx bx-chevrons-right"></i>
										</a>
									</div>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Index;
