import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { BankAccount } from '../types';

interface BankAccountsProps {
  accounts: BankAccount[];
  onChange: (accounts: BankAccount[]) => void;
}

export default function BankAccounts({ accounts, onChange }: BankAccountsProps) {
  const addAccount = () => {
    onChange([...accounts, { bank: '', accountName: '', accountNumber: '' }]);
  };

  const removeAccount = (index: number) => {
    onChange(accounts.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = accounts.map((account, i) => {
      if (i === index) {
        return { ...account, [field]: value };
      }
      return account;
    });
    onChange(newAccounts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Bank Accounts</label>
        <button
          type="button"
          onClick={addAccount}
          className="flex items-center text-sm text-pink-600 hover:text-pink-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Account
        </button>
      </div>
      
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={account.bank}
                onChange={(e) => updateAccount(index, 'bank', e.target.value)}
                placeholder="Bank Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={account.accountName}
                onChange={(e) => updateAccount(index, 'accountName', e.target.value)}
                placeholder="Account Holder Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={account.accountNumber}
                onChange={(e) => updateAccount(index, 'accountNumber', e.target.value)}
                placeholder="Account Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={() => removeAccount(index)}
              className="p-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}