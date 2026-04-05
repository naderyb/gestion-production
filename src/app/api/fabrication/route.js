import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT of.*, p.nom as produit_nom, c.id as commande_ref
      FROM ordres_fabrication of
      JOIN produits p ON of.produit_id = p.id
      JOIN commandes c ON of.commande_id = c.id
      ORDER BY of.created_at DESC
    `);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}