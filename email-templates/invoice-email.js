import baseUrl from "@/utils/baseUrl";
import { transport } from "./config";
import { User } from "@/database/models";

export const invoiceEmail = async (user, amount, cartItems, invoiceDate) => {


	const coursesList = cartItems.map(item => `
        <tr>
            <td style="margin-left:10px; padding: 8px 0; border-bottom: 1px solid #D7DAE0;">${item.title}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #D7DAE0; text-align: end;">${item.price}</td>
			<td style="padding: 8px 0; border-bottom: 1px solid #D7DAE0; text-align: end;">${item.price}</td>
        </tr>`).join('');



	const data = {
		to: user.email,
		from: "Ivy Dude <info@ivydude.com>",
		subject: " Ivy Dude Account | Invoice",
		html: `
        <div style="max-width: 800px;margin: auto;padding: 16px;border: 1px solid #eee;font-size: 16px;line-height: 24px;font-family: 'Inter', sans-serif;color: #555;background-color: #F9FAFC;">
	<table style="font-size: 12px; line-height: 20px;">
		<thead>
			<tr>
				<td style="padding: 0 16px 18px 16px;">
					<h1 style="color: #104c6e;font-size: 18px;font-style: normal;font-weight: 600;line-height: normal;">
						IvyDude</h1>
					<p>info@ivydude.com</p>
					<p>+91 8310 152 022</p>
				</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<table style="background-color: #FFF; padding: 20px 16px; border: 1px solid #D7DAE0;width: 100%; border-radius: 12px;font-size: 12px; line-height: 20px; table-layout: fixed;">
						<tbody>
							<tr>
								<td style="vertical-align: top; width: 30%; padding-right: 20px;padding-bottom: 35px;">
									<p style="margin-left:10px; font-weight: 700; color: #1A1C21;">${user.first_name} ${user.last_name}</p>
									<p style="margin-left:10px; color: #5E6470;">${user.email}</p>
								</td>
							</tr>
							<tr>
								<td style="padding-bottom: 13px;">
									<p style="color: #5E6470;">Service </p>
									<p style="font-weight: 700; color: #1A1C21;">Delivery Service</p>
								</td>
								
								<td style="text-align: end; padding-bottom: 13px;">
									<p style="color: #5E6470;">Invoice date</p>
									<p style="font-weight: 700; color: #1A1C21;">${invoiceDate}</p>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<table style="width: 100%;border-spacing: 0;">
										<thead>
											<tr style="text-transform: uppercase;">
												<td style=" margin-left:10px; padding: 8px 0; border-block:1px solid #D7DAE0;">Item Detail</td>
												
												<td style="padding: 8px 0; border-block:1px solid #D7DAE0; text-align: end; width: 100px;">
													Rate</td>
												<td style="padding: 8px 0; border-block:1px solid #D7DAE0; text-align: end; width: 120px;">
													Amount</td>
											</tr>
										</thead>
										<tbody>
											${coursesList}
										</tbody>
										<tfoot>
											<tr>
												<td style="padding: 12px 0; border-top:1px solid #D7DAE0;"></td>
												<td style="border-top:1px solid #D7DAE0;" colspan="3">
													<table style="width: 100%;border-spacing: 0;">
	
														<tfoot>
															<tr>
																<th style="padding: 12px 0 30px 0;text-align: start; color: #1A1C21;border-top:1px solid #D7DAE0;">
																	Total Price</th>
																<th style="padding: 12px 0 30px 0;text-align: end; color: #1A1C21;border-top:1px solid #D7DAE0;">
																${(amount / 100).toFixed(2)}</th>
															</tr>
														</tfoot>
													</table>
												</td>
											</tr>
											
										</tfoot>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td style="padding-top: 30px;">
					<p style="display: flex; gap: 0 13px;"><span style="color: #1A1C21;font-weight: 700;">IvyDude</span><span>Contact number:+91 8310 152 022</span></p>
					<p style="color: #1A1C21;">Any questions, contact customer service at <a href="mailto:info@ivydude.com" style="color: #000;">info@ivydude.com</a>.</p>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
        `

	};

	try {
		await transport.sendMail(data);

	} catch (error) {
		console.error("Error sending invoice email:", error);
	} finally {
		transport.close();
	}
};