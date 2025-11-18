import React, { useEffect, useState } from 'react';

export const addItemToShipInventory = (item) => {
  const currentShipInventory = localStorage.getItem("shipInventory") 
    ? JSON.parse(localStorage.getItem("shipInventory")) 
    : [];
  
  const newItem = {
    id: Date.now(),
    name: item.name,
    weight: parseFloat(item.weight) || 0,
    value: parseFloat(item.value || item.price) || 0,
    conductive: item.conductive || false,
    twoHanded: item.twoHanded || false
  };

  const updatedShipInventory = [...currentShipInventory, newItem];
  localStorage.setItem("shipInventory", JSON.stringify(updatedShipInventory));
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('shipInventoryUpdated', { 
    detail: { newItem, inventory: updatedShipInventory } 
  }));
  
  return true;
};

const ShipInventory = ({daysUntilDeadline}) => {
  const [shipItems, setShipItems] = useState(() => {
    if(localStorage.getItem("shipInventory")) {
      return JSON.parse(localStorage.getItem("shipInventory"));
    }
    return [];
  });
  const [keepItems, setKeepItems] = useState(() => {
    if(localStorage.getItem("keepItems")) {
      return JSON.parse(localStorage.getItem("keepItems"));
    }
    return [];
  });
  const [shipMoney, setShipMoney] = useState(() => {
    if(localStorage.getItem("shipMoney")) return parseInt(localStorage.getItem("shipMoney"));
    return 0;
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(0);
  const [newItemValue, setNewItemValue] = useState(0);
  const [newItemConductive, setNewItemConductive] = useState(false);
  const [newItemTwoHanded, setNewItemTwoHanded] = useState(false);
  const [addToKeepSection, setAddToKeepSection] = useState(false);
  const [moneyAdjustment, setMoneyAdjustment] = useState(0);

  useEffect(() => {
    localStorage.setItem("shipInventory", JSON.stringify(shipItems));
  }, [shipItems]);

  useEffect(() => {
    localStorage.setItem("keepItems", JSON.stringify(keepItems));
  }, [keepItems]);

  useEffect(() => {
    localStorage.setItem("shipMoney", shipMoney);
  }, [shipMoney]);

  useEffect(() => {
    const handleInventoryUpdate = (event) => {
      setShipItems(event.detail.inventory);
    };

    window.addEventListener('shipInventoryUpdated', handleInventoryUpdate);
    
    return () => {
      window.removeEventListener('shipInventoryUpdated', handleInventoryUpdate);
    };
  }, []);

  const addItem = () => {
    if (!newItemName.trim()) {
      alert('Please enter an item name!');
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      weight: parseFloat(newItemWeight) || 0,
      value: parseFloat(newItemValue) || 0,
      conductive: newItemConductive,
      twoHanded: newItemTwoHanded
    };

    if (addToKeepSection) {
      setKeepItems(prev => [...prev, newItem]);
    } else {
      setShipItems(prev => [...prev, newItem]);
    }
    
    // Clear form
    setNewItemName('');
    setNewItemWeight(0);
    setNewItemValue(0);
    setNewItemConductive(false);
    setNewItemTwoHanded(false);
    setAddToKeepSection(false);
  };

  const removeItem = (itemId) => {
    setShipItems(prev => prev.filter(item => item.id !== itemId));
  };

  const removeKeepItem = (itemId) => {
    setKeepItems(prev => prev.filter(item => item.id !== itemId));
  };

  const moveToKeep = (item) => {
    removeItem(item.id);
    setKeepItems(prev => [...prev, item]);
  };

  const moveToSell = (item) => {
    removeKeepItem(item.id);
    setShipItems(prev => [...prev, item]);
  };

  const sellAllItems = () => {
    const sellValue = daysUntilDeadline === 2 ? Math.round(calculateTotals().totalValue * 0.33) : 
                     daysUntilDeadline === 1 ? Math.round(calculateTotals().totalValue * 0.53) : 
                     daysUntilDeadline === 0 ? Math.round(calculateTotals().totalValue * 0.77) : 
                     calculateTotals().totalValue;
    
    setShipMoney(prev => prev + sellValue);
    setShipItems([]);
  };

  const sellItem = (item) => {
    const sellValue = daysUntilDeadline === 2 ? Math.round(item.value * 0.33) : 
                     daysUntilDeadline === 1 ? Math.round(item.value * 0.53) : 
                     daysUntilDeadline === 0 ? Math.round(item.value * 0.77) : 
                     item.value;
    
    setShipMoney(prev => prev + sellValue);
    removeItem(item.id);
  };

  const adjustMoney = (amount) => {
    setShipMoney(prev => Math.max(0, prev + amount));
    setMoneyAdjustment(0);
  };

  const calculateTotals = () => {
    const totalValue = shipItems.reduce((sum, item) => sum + item.value, 0);
    const totalWeight = shipItems.reduce((sum, item) => sum + item.weight, 0);
    const itemCount = shipItems.length;

    const keepTotalValue = keepItems.reduce((sum, item) => sum + item.value, 0);
    const keepTotalWeight = keepItems.reduce((sum, item) => sum + item.weight, 0);
    const keepItemCount = keepItems.length;

    return { 
      totalValue, 
      totalWeight, 
      itemCount, 
      keepTotalValue, 
      keepTotalWeight, 
      keepItemCount,
      grandTotalValue: totalValue + keepTotalValue,
      grandTotalWeight: totalWeight + keepTotalWeight,
      grandTotalCount: itemCount + keepItemCount
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">🚢 Ship Inventory</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-white">Total Items: <span className="font-bold">{totals.grandTotalCount}</span></span>
            <span className="text-white">Total Weight: <span className="font-bold">{totals.grandTotalWeight.toFixed(1)} lbs</span></span>
            <span className="text-green-400 font-bold">For Sale: {totals.totalValue}¢ ({totals.itemCount} items)</span>
            <span className="text-blue-400 font-bold">Keeping: {totals.keepTotalValue}¢ ({totals.keepItemCount} items)</span>
          </div>
        </div>
      </div>

      {/* Money Management */}
      <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-green-300 text-sm">💰 Ship Credits</h4>
          <span className="text-green-400 font-bold text-lg">{shipMoney}¢</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Amount to add/remove"
            value={moneyAdjustment}
            onChange={(e) => setMoneyAdjustment(parseFloat(e.target.value) || 0)}
            className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-sm"
          />
          <button
            onClick={() => adjustMoney(moneyAdjustment)}
            disabled={moneyAdjustment === 0}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              moneyAdjustment === 0
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : moneyAdjustment > 0
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            ➕ Add
          </button>
          <button
            onClick={() => adjustMoney(-moneyAdjustment)}
            disabled={moneyAdjustment === 0}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              moneyAdjustment === 0
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : moneyAdjustment > 0
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            ➖ Remove
          </button>
          <button
            onClick={sellAllItems}
            disabled={totals.itemCount === 0}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              totals.itemCount === 0
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            💸 Sell All ({
                daysUntilDeadline === 2 ? Math.round(totals.totalValue * 0.33) : 
                daysUntilDeadline === 1 ? Math.round(totals.totalValue * 0.53) : 
                daysUntilDeadline === 0 ? Math.round(totals.totalValue * 0.77) : 
                totals.totalValue
              }¢)
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
        <h4 className="font-semibold text-blue-300 mb-2 text-sm">➕ Add Item to Ship</h4>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          <input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="col-span-2 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-sm"
          />
          <input
            type="number"
            placeholder="Weight (lbs)"
            value={newItemWeight}
            onChange={(e) => setNewItemWeight(e.target.value)}
            className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-sm"
          />
          <input
            type="number"
            placeholder="Value (¢)"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-sm"
          />
          <div className="flex items-center space-x-2 text-sm">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={newItemConductive}
                onChange={(e) => setNewItemConductive(e.target.checked)}
                className="w-3 h-3"
              />
              <span className="text-blue-300">⚡ Conductive</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={newItemTwoHanded}
                onChange={(e) => setNewItemTwoHanded(e.target.checked)}
                className="w-3 h-3"
              />
              <span className="text-orange-300">🤲 Two-Hand</span>
            </label>
          </div>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={addToKeepSection}
              onChange={(e) => setAddToKeepSection(e.target.checked)}
              className="w-3 h-3"
            />
            <span className="text-purple-300">🔒 Keep on Ship</span>
          </label>
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Ship Items List - For Sale */}
      <div className="bg-slate-700 rounded-lg border border-slate-500">
        <div className="p-3 border-b border-slate-600">
          <h4 className="font-semibold text-white text-sm">💰 Items for Sale</h4>
          <div className="text-xs text-slate-300 mt-1">
            Sell Value: {
              daysUntilDeadline === 2 ? Math.round(totals.totalValue * 0.33) : 
              daysUntilDeadline === 1 ? Math.round(totals.totalValue * 0.53) : 
              daysUntilDeadline === 0 ? Math.round(totals.totalValue * 0.77) : 
              totals.totalValue
            }¢ ({totals.itemCount} items)
          </div>
        </div>
        
        {shipItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <div className="text-4xl mb-2">💰</div>
            <p>No items marked for sale</p>
          </div>
        ) : (
          <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
            {shipItems.sort((a, b) => b.value - a.value).map((item) => (
              <div key={item.id} className="bg-slate-600 rounded p-2 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 grid grid-cols-5 gap-1">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-slate-300 text-sm">{item.weight} lbs</span>
                    <span className="text-green-300 text-sm">{item.value}¢</span>
                    <span className="text-blue-300 text-xs"> {item.conductive ? "Conductive" : ""}</span>
                    <span className="text-orange-300 text-xs"> {item.twoHanded ? "Two Handed" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => sellItem(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                    title={`Sell for ${
                      daysUntilDeadline === 2 ? Math.round(item.value * 0.33) : 
                      daysUntilDeadline === 1 ? Math.round(item.value * 0.53) : 
                      daysUntilDeadline === 0 ? Math.round(item.value * 0.77) : 
                      item.value
                    }¢`}
                  >
                    💰 Sell
                  </button>
                  <button
                    onClick={() => moveToKeep(item)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                    title="Move to keep section"
                  >
                    🔒 Lock
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keep Items List */}
      <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg">
        <div className="p-3 border-b border-purple-600/30">
          <h4 className="font-semibold text-purple-300 text-sm">🔒 Items to Keep on Ship</h4>
          <div className="text-xs text-purple-200 mt-1">
            Value: {totals.keepTotalValue}¢ ({totals.keepItemCount} items) • These won't be sold
          </div>
        </div>
        
        {keepItems.length === 0 ? (
          <div className="p-6 text-center text-purple-300">
            <div className="text-4xl mb-2">🔒</div>
            <p>No items marked to keep</p>
          </div>
        ) : (
          <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
            {keepItems.sort((a, b) => b.value - a.value).map((item) => (
              <div key={item.id} className="bg-purple-600/30 rounded p-2 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 grid grid-cols-5 gap-1">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-purple-200 text-sm">{item.weight} lbs</span>
                    <span className="text-purple-200 text-sm">{item.value}¢</span>
                    <span className="text-blue-300 text-xs"> {item.conductive ? "Conductive" : ""}</span>
                    <span className="text-orange-300 text-xs"> {item.twoHanded ? "Two Handed" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveToSell(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                    title="Move to sell section"
                  >
                    💰 Unlock
                  </button>
                  <button
                    onClick={() => removeKeepItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipInventory;