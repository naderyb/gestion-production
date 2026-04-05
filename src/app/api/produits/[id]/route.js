import pool from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nom, description, prix, stock, stock_minimum, cout_production, categorie_id } = body;

    await pool.query(
      'UPDATE produits SET nom=?, description=?, prix=?, stock=?, stock_minimum=?, cout_production=?, categorie_id=? WHERE id=?',
      [nom, description, prix, stock, stock_minimum, cout_production, categorie_id, id]
    );

    return Response.json({ message: 'Produit modifié avec succès' });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM commande_produits WHERE produit_id=?', [id]);
    await pool.query('DELETE FROM ordres_fabrication WHERE produit_id=?', [id]);
    await pool.query('DELETE FROM produits WHERE id=?', [id]);
    return Response.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}