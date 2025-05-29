import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import StoryReviewPage from './pages/StoryReviewPage';
import RecordPage from './pages/RecordPage';
import FamilyTreePage from './pages/FamilyTreePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import MemoirPage from './pages/MemoirPage';
import MemoirStorySelectionPage from './pages/MemoirStorySelectionPage';
import MemoirChapterPage from './pages/MemoirChapterPage';
import MemoirPathChoicePage from './pages/MemoirPathChoicePage';
import MemoirEditorPage from './pages/MemoirEditorPage';
import MemoirPreviewPage from './pages/MemoirPreviewPage';

// Auth
import { useAuth } from './hooks/useAuth';

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="stories" element={
            user ? <StoriesPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="stories/:storyId" element={
            user ? <StoryDetailPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="stories/:storyId/review" element={
            user ? <StoryReviewPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="record" element={
            user ? <RecordPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="family-tree" element={
            user ? <FamilyTreePage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="profile" element={
            user ? <ProfilePage /> : <Navigate to="/auth\" replace />
          } />
          
          {/* Memoir Routes */}
          <Route path="memoirs" element={
            user ? <MemoirPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="memoirs/new/select-stories" element={
            user ? <MemoirStorySelectionPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="memoirs/new/chapters" element={
            user ? <MemoirChapterPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="memoirs/new/path" element={
            user ? <MemoirPathChoicePage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="memoirs/new/editor" element={
            user ? <MemoirEditorPage /> : <Navigate to="/auth\" replace />
          } />
          <Route path="memoirs/new/preview" element={
            user ? <MemoirPreviewPage /> : <Navigate to="/auth\" replace />
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;