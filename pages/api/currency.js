import axios from 'axios';
import Currency_Rate from 'database/models/currency_rate';

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await handleGet(req, res);
            break;
        case "POST":
            await handlePost(req, res);
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}


const handleGet = async (req, res) => {
    try {
        const baseCurrency = 'USD';
        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;


        const response = await axios.get(apiUrl);
        const rates = response.data.rates;


        res.status(200).json({ rates });
    } catch (e) {
        console.error('Error fetching currency rates:', e.message);
        res.status(500).json({
            error_code: "fetch_currency_rates",
            message: e.message,
        });
    }
};

const handlePost = async (req, res) => {

    const { currency, rate, date } = req.body;

    console.log('post request');

    console.log('Request body:', req.body);


    try {

        if (!currency || !rate || !date) {
            return res.status(400).json({
                error_code: "missing_data",
                message: "Currency, rates, and date are required",
            });
        }

        await Currency_Rate.destroy({
            where: { currency: currency, date: date },
        });


        console.log(`Creating new record with currency: ${currency}`);

        const newRates = await Currency_Rate.create({
            currency:"USD",
            rate:"80",
            date: new date(),
        });

        console.log("New record created:", newRates);

        res.status(200).json({
            message: "Currency rates saved successfully.",
            newRates,
        });
    } catch (error) {
        console.error('Error saving currency rates---->:', error.message);
        res.status(500).json({
            error_code: "save_currency_rates",
            message: error.message,
        });
    }
};
