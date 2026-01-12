import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import CraftModal from '../Modals/CraftModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Craft from "../Sub_Components/Craft";

import data from '../Data/CraftData';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const severityClasses = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    warning: 'bg-amber-500 border-amber-400',
    info: 'bg-blue-500 border-blue-400'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${severityClasses[severity]} text-white px-6 py-4 rounded-lg border shadow-xl flex items-center space-x-3 min-w-80`}>
        <div className="text-xl font-bold">{icons[severity]}</div>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function Crafts() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('-1');
  const [filterDifficulty, setFilterDifficulty] = useState('-1');
  const [filterWorkshop, setFilterWorkshop] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, recipeData: null });
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload crafting data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'recipe' : 'recipes'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const recipeData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Crafting', data[i].id), recipeData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'recipe' : 'recipes'}!`);
    } catch (error) {
      showToast('Error adding crafting data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (recipeId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change recipe visibility', 'error');
      return;
    }

    try {
      const recipeRef = doc(db, 'Crafting', recipeId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(recipeRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Recipe ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating recipe visibility', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getRecipesFromDB();
    }
  }, [sessionId]);

  const getRecipesFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Crafting'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          ...data,
          isHidden: sessionVisibility[sessionId] !== 'visible'
        });
      });
      setRecipes(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredRecipes = () => {
    let filtered = recipes;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(recipe => recipe.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(recipe => !recipe.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name?.toLowerCase().includes(search) ||
        recipe.result_item_id?.toLowerCase().includes(search) ||
        recipe.crafting_notes?.toLowerCase().includes(search)
      );
    }

    // Filter by skill
    if (filterSkill !== '-1') {
      filtered = filtered.filter(recipe => 
        recipe.crafting_skill === filterSkill
      );
    }

    // Filter by difficulty
    if (filterDifficulty !== '-1') {
      filtered = filtered.filter(recipe => 
        recipe.base_difficulty === filterDifficulty
      );
    }

    // Filter by workshop requirement
    if (filterWorkshop === 'required') {
      filtered = filtered.filter(recipe => recipe.required_workshop !== null);
    } else if (filterWorkshop === 'none') {
      filtered = filtered.filter(recipe => recipe.required_workshop === null);
    }

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterSkill !== '-1') count++;
    if (filterDifficulty !== '-1') count++;
    if (filterWorkshop !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterSkill('-1');
    setFilterDifficulty('-1');
    setFilterWorkshop('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (recipe) => {
    setDetailsModal({ isOpen: true, recipeData: recipe });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, recipeData: null });
  };

  // Update modal data when recipes change (for real-time updates)
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.recipeData) {
      const updatedRecipe = recipes.find(r => r.id === detailsModal.recipeData.id);
      if (updatedRecipe) {
        setDetailsModal(prev => ({ ...prev, recipeData: updatedRecipe }));
      }
    }
  }, [recipes]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Crafting Skill</label>
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Skills</option>
            <option value="Metalworking">Metalworking</option>
            <option value="Leatherworking">Leatherworking</option>
            <option value="Alchemy">Alchemy</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cooking">Cooking</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Difficulty</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Difficulties</option>
            <option value="Simple">Simple</option>
            <option value="Easy">Easy</option>
            <option value="Average">Average</option>
            <option value="Hard">Hard</option>
            <option value="Daunting">Daunting</option>
          </select>
        </div>

        {/* Workshop Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Workshop Requirement</label>
          <select
            value={filterWorkshop}
            onChange={(e) => setFilterWorkshop(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Recipes</option>
            <option value="required">Workshop Required</option>
            <option value="none">No Workshop Needed</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-purple-600/10 rounded-lg p-4 border border-purple-500/30">
          <span className="text-purple-300 font-medium">Show hidden recipes only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      )}

      {/* Reset Button */}
      {getActiveFilterCount() > 0 && (
        <button
          onClick={resetFilters}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-lg border border-red-500/50 transition-all"
        >
          Reset Filters ({getActiveFilterCount()} active)
        </button>
      )}
    </div>
  );

  const filteredRecipes = getFilteredRecipes();

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Crafting Recipes</h1>
            <p className="text-gray-400">Browse available crafting recipes</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Upload Recipes
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search recipes by name, item, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-all flex items-center justify-between mb-4"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </span>
          <svg className={`w-5 h-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mb-4">
            <FilterSection />
          </div>
        )}

        {/* Results Count */}
        <div className="text-gray-400 text-sm">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No recipes found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Craft
                key={recipe.id}
                recipe={recipe}
                onClick={() => openDetailsModal(recipe)}
                isHidden={recipe.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <CraftModal
          recipe={detailsModal.recipeData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
        />
      )}
    </div>
  );
}