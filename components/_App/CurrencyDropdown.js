import React from 'react';

const CurrencyDropdown = ({ selectedCurrency, onCurrencyChange }) => {
    const handleCurrencySelect = (event) => {
        const currency = event.target.value;
        onCurrencyChange(currency);
    };

    return (
        <div className="currency-dropdown">
            <select value={selectedCurrency} onChange={handleCurrencySelect} className="currency-select">
                <option value="USD">USD &nbsp; &#36;</option>
                <option value="INR">INR  &nbsp; &#8377;</option>               
            </select>
        </div>
    );
};

export default CurrencyDropdown;
