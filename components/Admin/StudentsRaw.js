import React from "react";

const StudentsRaw = ({
	id,
	first_name,
	last_name, 
	email,
	phone,
	studentLevel,
	bio,
	email_confirmed,
	role,
	onAdmin = null,
	students,
}) => {
	console.log("level",studentLevel)
	return (
		<tr>
			<td>{`${first_name} ${last_name}`}</td>
			<td>{email}</td>
			<td>{phone ? phone : "N/A"}</td>
			<td>{studentLevel}</td>
			<td>{email_confirmed ? "Yes" : "No"}</td>
			<td>
				<div className="max-300px max-height-60">
					{bio ? bio : "N/A"}
				</div>
			</td>
		</tr>
		// <tr>
		// 	<td>{`${students.first_name} ${students.last_name}`}</td>
		// 	<td>{email}</td>
		// 	<td>{phone ? phone : "N/A"}</td>
		// 	<td>{studentLevel}</td>
		// 	<td>{email_confirmed ? "Yes" : "No"}</td>
		// 	<td>
		// 		<div className="max-300px max-height-60">
		// 			{bio ? bio : "N/A"}
		// 		</div>
		// 	</td>
		// </tr>
		
	);
};

export default StudentsRaw;
