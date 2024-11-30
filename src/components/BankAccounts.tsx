import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { BankAccount } from '../types';

interface BankAccountsProps {
  accounts: BankAccount[];
  onChange: (accounts: BankAccount[]) => void;
}

export default function BankAccounts({ accounts, onChange }: BankAccountsProps) {
  const addAccount = () => {
    try {
      // Validasi jumlah maksimum akun bank
      if (accounts.length >= 5) {
        throw new Error('Maksimum 5 akun bank yang dapat ditambahkan');
      }

      const newAccounts = [...accounts, { bank: '', accountName: '', accountNumber: '' }];
      onChange(newAccounts);
    } catch (error: any) {
      console.error('Error adding bank account:', error);
      alert(error.message || 'Gagal menambahkan akun bank');
    }
  };

  const removeAccount = (index: number) => {
    try {
      const newAccounts = accounts.filter((_, i) => i !== index);
      onChange(newAccounts);
    } catch (error: any) {
      console.error('Error removing bank account:', error);
      alert('Gagal menghapus akun bank');
    }
  };

  const updateAccount = (index: number, field: keyof BankAccount, value: string) => {
    try {
      // Validasi panjang input
      if (value.length > 100) {
        throw new Error('Input terlalu panjang (maksimum 100 karakter)');
      }

      // Validasi khusus untuk nomor rekening
      if (field === 'accountNumber') {
        if (!/^\d*$/.test(value)) {
          throw new Error('Nomor rekening hanya boleh berisi angka');
        }
        if (value.length > 20) {
          throw new Error('Nomor rekening terlalu panjang (maksimum 20 digit)');
        }
      }

      // Validasi nama pemilik rekening
      if (field === 'accountName') {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          throw new Error('Nama pemilik rekening hanya boleh berisi huruf dan spasi');
        }
      }

      const newAccounts = accounts.map((account, i) => {
        if (i === index) {
          return { ...account, [field]: value };
        }
        return account;
      });

      onChange(newAccounts);
    } catch (error: any) {
      console.error('Error updating bank account:', error);
      alert(error.message || 'Gagal mengupdate akun bank');
    }
  };

  return (
    <div className="bg-[#F5E9E2] rounded-lg shadow-lg p-6 space-y-6">
      <div className="text-2xl font-bold text-[#8B7355] mb-6">Bank Accounts</div>
      
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200">
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
      <div className="mt-4 flex items-center justify-between space-x-4">
        <button
          type="button"
          onClick={addAccount}
          className="px-4 py-2 bg-[#D4B996] text-white rounded-md hover:bg-[#C4A576] transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Account
        </button>
      </div>
    </div>
  );
}