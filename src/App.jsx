import './index.css';
import Header from './components/Header.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import SearchTerm from './components/SearchTerm';
import FlipPage from './components/FlipPage';

function App() {
  return (
    <div className="App">
      <Header/>
      <ImageUpload/>
      <SearchTerm/>
      <FlipPage/>
    </div>
  );
}

export default App;
