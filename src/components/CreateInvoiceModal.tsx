import React, { useState, useEffect } from 'react';
import { X, Calculator, CreditCard, User, Mail, DollarSign, Calendar, Plus, Trash2, FileText } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types/invoice';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoice: Invoice) => void;
}

export default function CreateInvoiceModal({ isOpen, onClose, onAdd }: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    taxRate: 18,
    discount: 0,
    notes: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending' as Invoice['status'],
    transactionId: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);

  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const currentSubTotal = items.reduce((acc, item) => acc + item.total, 0);
    setSubTotal(currentSubTotal);

    const baseAmount = Math.max(0, currentSubTotal - (formData.discount || 0));
    const tax = (baseAmount * (formData.taxRate || 0)) / 100;
    
    setTaxAmount(tax);
    setFinalAmount(baseAmount + tax);
  }, [items, formData.discount, formData.taxRate]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substring(2, 9), description: '', quantity: 1, price: 0, total: 0 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = (Number(updatedItem.quantity) || 0) * (Number(updatedItem.price) || 0);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseAmount = Math.max(0, subTotal - (formData.discount || 0));
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      items,
      subTotal,
      total: baseAmount,
      createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      taxAmount,
      finalAmount,
      amountDue: formData.status === 'Paid' ? 0 : finalAmount,
      avatar: `https://picsum.photos/seed/${formData.name.split(' ')[0] || 'user'}/40/40`,
    };
    onAdd(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-black w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Invoice</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Details</label>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 w-24">Qty</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Price</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Total</th>
                      <th className="p-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.id} className="bg-white dark:bg-black">
                        <td className="p-2">
                          <input
                            required
                            type="text"
                            placeholder="Item description"
                            className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-blue-500 transition-all"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            required
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-blue-500 transition-all"
                            value={item.quantity === 0 ? '' : item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              required
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full pl-7 pr-3 py-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-blue-500 transition-all"
                              value={item.price === 0 ? '' : item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="px-3 py-2 bg-white dark:bg-black rounded text-gray-700 dark:text-gray-200 font-medium border border-gray-100 dark:border-gray-800">
                            ${item.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length === 1}
                            className={`p-1.5 rounded-lg transition-colors ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:bg-red-50 dark:bg-red-900/20 hover:text-red-600'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Discount & Taxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extra Discount ($)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.discount === 0 ? '' : formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST (%)</label>
              <div className="relative">
                <Calculator size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="18"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.taxRate === 0 ? '' : formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes / Terms</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                rows={2}
                placeholder="Thank you for your business..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20/50 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <div className="flex justify-between md:justify-start gap-8 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Sub-Total:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">${subTotal.toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between md:justify-start gap-8 text-sm">
                  <span className="text-red-400">Discount:</span>
                  <span className="font-semibold text-red-500">-${formData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between md:justify-start gap-8 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax ({formData.taxRate}%):</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">${taxAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-right w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-blue-100">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Final Payable</p>
              <p className="text-3xl font-black text-blue-700">${finalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Other Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ref No.</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="TXN123456789"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="date"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</label>
              <select
                className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-white dark:bg-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
