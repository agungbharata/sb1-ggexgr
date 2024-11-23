import React, { useState } from 'react';
import { Gift, CreditCard } from 'lucide-react';
import type { BankAccount, Gift as GiftType } from '../types';

interface GiftSectionProps {
  invitationId: string;
  bankAccounts: BankAccount[];
}

export default function GiftSection({ invitationId, bankAccounts }: GiftSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [giftData, setGiftData] = useState({
    senderName: '',
    amount: '',
    message: '',
    bankAccount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const gift: GiftType = {
      id: crypto.randomUUID(),
      invitationId,
      senderName: giftData.senderName,
      amount: Number(giftData.amount),
      message: giftData.message,
      bankAccount: giftData.bankAccount,
      createdAt: new Date().toISOString(),
      confirmed: false
    };

    // Save to localStorage
    const gifts = JSON.parse(localStorage.getItem(`gifts_${invitationId}`) || '[]');
    localStorage.setItem(`gifts_${invitationId}`, JSON.stringify([...gifts, gift]));

    // Reset form
    setGiftData({
      senderName: '',
      amount: '',
      message: '',
      bankAccount: ''
    });
    setShowForm(false);
    alert('Thank you for your gift! The couple will be notified.');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Gift className="w-5 h-5 mr-2" />
        Wedding Gift
      </h3>

      {!showForm ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Your presence is our present. However, if you wish to give a gift, you can send it through here.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Send Gift
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={giftData.senderName}
              onChange={(e) => setGiftData({ ...giftData, senderName: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={giftData.amount}
              onChange={(e) => setGiftData({ ...giftData, amount: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
            <select
              value={giftData.bankAccount}
              onChange={(e) => setGiftData({ ...giftData, bankAccount: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select bank account</option>
              {bankAccounts.map((account, index) => (
                <option key={index} value={account.accountNumber}>
                  {account.bank} - {account.accountName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
            <textarea
              value={giftData.message}
              onChange={(e) => setGiftData({ ...giftData, message: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Send Gift
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}