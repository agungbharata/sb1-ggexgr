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
    <div className="bg-[#F5E9E2] rounded-lg shadow-lg p-6">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center space-x-2">
          <Gift className="w-6 h-6 text-[#8B7355]" />
          <h3 className="text-2xl font-bold text-[#8B7355] mb-6">Wedding Gift</h3>
        </div>
        <p className="text-[#6B5B4E] mb-4">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.<br/>
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bankAccounts.map((account, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#F5E9E2] rounded-lg">
                <Building2 className="w-6 h-6 text-[#8B7355]" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#8B7355] mb-2">{account.bank}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-[#6B5B4E] select-all">{account.accountNumber}</p>
                  <p className="text-sm text-[#6B5B4E]">({account.accountName})</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleCopy(account.accountNumber)}
                className="px-4 py-2 bg-[#D4B996] text-white rounded-md hover:bg-[#C4A576] transition-colors duration-200"
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
          </div>
        ))}
      </div>
    </div>
  );
}