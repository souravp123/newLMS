import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initCurrency_Rate = (sequelize, Types) => {
	class Currency_Rate extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Currency_Rate.init(
		{
			id: {
				type: Types.UUID,
				defaultValue: Types.UUIDV4,
				primaryKey: true,
			},
			rate: DataTypes.STRING,
			date: DataTypes.DATE,
            currency: DataTypes.STRING,

		},
		{
			sequelize, 
			modelName: "Currency_Rate",
			tableName: "currency_rates",
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
	return Currency_Rate;
};
export default initCurrency_Rate(connection, DataTypes);
