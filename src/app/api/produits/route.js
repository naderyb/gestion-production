import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM produits ORDER BY created_at DESC');
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, description, prix, stock, stock_minimum, cout_production, categorie_id } = body;

    const [result] = await pool.query(
      'INSERT INTO produits (nom, description, prix, stock, stock_minimum, cout_production, categorie_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, description, prix, stock, stock_minimum, cout_production, categorie_id]
    );

    return Response.json({ id: result.insertId, message: 'Produit créé avec succès' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}