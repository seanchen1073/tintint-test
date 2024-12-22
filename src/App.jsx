import './index.css';
import Header from './components/Header.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import SearchTerm from './components/SearchTerm';

function App() {
  return (
    <div className="App">
      <Header/>
      <ImageUpload/>
      <SearchTerm />
    </div>
  );
}

export default App;
