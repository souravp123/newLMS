import { Model, DataTypes } from "sequelize";
import connection from "../connection";
// import { getCurrentDateTimeString } from "../utils/dateUtils";

const initEnrolment = (sequelize, Types) => {
	class Enrolment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Enrolment.init(
		{
			id: {
				type: Types.UUID,
				defaultValue: Types.UUIDV4,
				primaryKey: true,
			},
			bought_price: DataTypes.FLOAT,
			payment_method: DataTypes.STRING,
			buyer_name: DataTypes.STRING,
			buyer_email: DataTypes.STRING,
			start_date: DataTypes.DATE,
			end_date: DataTypes.DATE,
			buyer_avatar: DataTypes.STRING,
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				onDelete: "CASCADE",
				references: {
					model: "users",
					key: "id",
					as: "userId",
				},
			},
			courseId: {
				type: DataTypes.UUID,
				allowNull: false,
				onDelete: "CASCADE",
				references: {
					model: "courses",
					key: "id",
					as: "courseId",
				},
			}, 
			status: {
				type: DataTypes.ENUM,
				values: ["paid", "unpaid"],
			},
			rz_pay_plan_id: DataTypes.STRING,
			rz_pay_subscription_id: DataTypes.STRING,
			rz_pay_subscription_status: DataTypes.STRING
		},
		{
			sequelize,
			modelName: "Enrolment",
			tableName: "enrolments",
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);



	return Enrolment;
};

export default initEnrolment(connection, DataTypes);
