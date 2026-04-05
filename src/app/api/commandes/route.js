import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cl.nom as client_nom, cl.email as client_email 
      FROM commandes c 
      JOIN clients cl ON c.client_id = cl.id 
      ORDER BY c.created_at DESC
    `);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { client_id, produits } = body;

    const [commande] = await pool.query(
      'INSERT INTO commandes (client_id, statut, total) VALUES (?, "en_attente", 0)',
      [client_id]
    );

    const commande_id = commande.insertId;
    let total = 0;

    for (const p of produits) {
      await pool.query(
        'INSERT INTO commande_produits (commande_id, produit_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [commande_id, p.produit_id, p.quantite, p.prix_unitaire]
      );
      total += p.quantite * p.prix_unitaire;
    }

    await pool.query('UPDATE commandes SET total=? WHERE id=?', [total, commande_id]);

    return Response.json({ id: commande_id, message: 'Commande créée avec succès' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}