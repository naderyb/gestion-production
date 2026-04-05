import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await pool.query('SELECT * FROM clients WHERE id=?', [id]);
    if (rows.length === 0) {
      return Response.json({ error: 'Client non trouvé' }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nom, email, telephone, adresse } = body;

    await pool.query(
      'UPDATE clients SET nom=?, email=?, telephone=?, adresse=? WHERE id=?',
      [nom, email, telephone, adresse, id]
    );

    return Response.json({ message: 'Client modifié avec succès' });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM commande_produits WHERE commande_id IN (SELECT id FROM commandes WHERE client_id=?)', [id]);
    await pool.query('DELETE FROM ordres_fabrication WHERE commande_id IN (SELECT id FROM commandes WHERE client_id=?)', [id]);
    await pool.query('DELETE FROM commandes WHERE client_id=?', [id]);
    await pool.query('DELETE FROM clients WHERE id=?', [id]);
    return Response.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}