import React, { useState } from 'react';
import { Gift, Copy, Check, Building2 } from 'lucide-react';
import type { BankAccount } from '../types';

interface GiftSectionProps {
  bankAccounts: BankAccount[];
}

export default function GiftSection({ bankAccounts }: GiftSectionProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center space-x-2">
          <Gift className="w-6 h-6 text-pink-500" />
          <h3 className="text-2xl font-serif text-gray-800">Wedding Gift</h3>
        </div>
        <p className="text-gray-600 italic">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.<br/>
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>
      </div>

      <div className="grid gap-4">
        {bankAccounts.map((account, index) => (
          <div key={index} className="bg-pink-50 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg">
                <Building2 className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{account.bank}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 select-all">{account.accountNumber}</p>
                  <p className="text-sm text-gray-500">({account.accountName})</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleCopy(account.accountNumber)}
              className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-200"
            >
              {copiedAccount === account.accountNumber ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Salin</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}