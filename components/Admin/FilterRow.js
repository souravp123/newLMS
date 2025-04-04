import React from "react";
import Link from "next/link";

const FilterRow = ({
	id,
	title,
	slug,
	latest_price,
	category,
	user,
	videos,
	approved,
	in_home_page,
	onApprove = null,
	onDeny = null,
	onHome = null,
	onHomeRemove = null,
}) => {
	return (
		<tr>
            <td>{user.first_name} {user.last_name}</td>
			<td>
				<Link href={`/course/${slug}`}>
					<a>{title}</a>
				</Link>
			</td>		
		</tr>
	);
};

export default FilterRow;
