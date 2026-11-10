import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import api from '../api';

export default function Home() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory, search, page]);

  async function loadData() {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory || undefined,
        search: search || undefined,
        limit: 50,
        offset: (page - 1) * 50,
      };
      const [gamesRes, catsRes] = await Promise.all([
        api.get('/games', { params }),
        api.get('/games/categories'),
      ]);
      setGames(gamesRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container" style={{ background: 'var(--bg-color, #fafafa)', minHeight: '100vh' }}>
      <nav className="navbar" style={{ position: 'static', marginBottom: 20, background: 'var(--nav-bg, #fff)', padding: '10px 0' }}>
        <div className="inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="logo-dot" style={{ width: 8, height: 8, background: '#e74c3c', borderRadius: 50 }}></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#2c3e50' }}>Paladyu</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(e.target.search.value); }} style={{ gap: 8, flex: 1, maxWidth: 500, marginLeft: 20 }}>
            <input
              type="text"
              className="btn btn-outline"
              style={{ flex: 1, textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px', fontWeight: 'normal', borderRadius: 20, border: '1px solid #ddd', fontSize: 14 }}
              placeholder="Oyun ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
            />
            <button type="submit" style={{ padding: '0 20', background: 'transparent', border: 'none', color: '#666', fontSize: 14, cursor: 'pointer' }}>Ara</button>
          </form>
          <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/profile" style={{ color: '#666', fontSize: 14, textDecoration: 'none' }}>
              <span style={{ border: '1px solid #ddd', borderRadius: 50, padding: '4px 8px' }}>Profil</span>
            </Link>
            <Link to="/register" style={{ color: '#e74c3c', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Kayıt Ol</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            className={"btn " + (!selectedCategory ? 'btn-accent' : 'btn-outline')}
            onClick={() => setSelectedCategory('')}
          >
            Hepsi
          </button>
          {categories.map((c) => (
            <button
              key={c.category}
              className={"btn " + (selectedCategory === c.category ? 'btn-accent' : 'btn-outline')}
              onClick={() => setSelectedCategory(c.category)}
            >
              {c.category} ({c.count})
            </button>
          ))}
        </div>

        <h2 className="section-title" style={{ marginBottom: 20, color: '#2c3e50' }}>Popüler Oyunlar</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            <div>Yükleniyor...</div>
          </div>
        ) : games.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Oyun bulunamadı.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginTop: 20 }}>
            {games.map((g) => (
              <GameCard key={g.id} game={g} navigate={navigate} />
            ))}
          </div>
        )}

        {games.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 30, color: '#666', fontSize: 14 }}>
            {page > 1 && <button onClick={() => setPage(page - 1)} style={{ marginRight: 10, padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}>Önceki</button>}
            {Math.ceil(3000 / 50) > page && <button onClick={() => setPage(page + 1)} style={{ marginLeft: 10, padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}>Sonraki</button>}
            {games.length + ' oyun ' + Math.ceil(3000 / 50) + ' sayfadan ' + page + ' sayfasi'}
          </div>
        )}
      </div>
    </div>
  );
}