from flask import render_template, request, redirect, url_for, flash, session
from flask_login import current_user
from app import app, db
from replit_auth import require_login, make_replit_blueprint
from models import Checklist, ChecklistItem

app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

# Make session permanent
@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route('/')
def index():
    """Landing page for logged out users, home page for logged in users"""
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    return render_template('index.html')

@app.route('/home')
@require_login
def home():
    """Home page showing user's checklists"""
    user_checklists = Checklist.query.filter_by(user_id=current_user.id).order_by(Checklist.created_at.desc()).all()
    return render_template('home.html', checklists=user_checklists)

@app.route('/create_checklist', methods=['POST'])
@require_login
def create_checklist():
    """Create a new checklist"""
    name = request.form.get('name', '').strip()
    color = request.form.get('color', 'pink')
    
    if not name:
        flash('Por favor, digite um nome para a lista!', 'error')
        return redirect(url_for('home'))
    
    # Validate color is in allowed pastel colors
    allowed_colors = ['pink', 'purple', 'blue', 'green', 'yellow']
    if color not in allowed_colors:
        color = 'pink'
    
    new_checklist = Checklist(name=name, color=color, user_id=current_user.id)
    
    db.session.add(new_checklist)
    db.session.commit()
    
    flash('Lista criada com sucesso! ✨', 'success')
    return redirect(url_for('home'))

@app.route('/delete_checklist/<int:checklist_id>', methods=['POST'])
@require_login
def delete_checklist(checklist_id):
    """Delete a checklist"""
    checklist = Checklist.query.filter_by(id=checklist_id, user_id=current_user.id).first()
    
    if not checklist:
        flash('Lista não encontrada!', 'error')
        return redirect(url_for('home'))
    
    db.session.delete(checklist)
    db.session.commit()
    
    flash('Lista excluída com sucesso! 🗑️', 'success')
    return redirect(url_for('home'))

@app.route('/add_item/<int:checklist_id>', methods=['POST'])
@require_login
def add_item(checklist_id):
    """Add an item to a checklist"""
    checklist = Checklist.query.filter_by(id=checklist_id, user_id=current_user.id).first()
    
    if not checklist:
        flash('Lista não encontrada!', 'error')
        return redirect(url_for('home'))
    
    item_text = request.form.get('item_text', '').strip()
    
    if not item_text:
        flash('Por favor, digite o texto do item!', 'error')
        return redirect(url_for('home'))
    
    new_item = ChecklistItem(text=item_text, checklist_id=checklist_id)
    
    db.session.add(new_item)
    db.session.commit()
    
    flash('Item adicionado com sucesso! ✅', 'success')
    return redirect(url_for('home'))

@app.route('/toggle_item/<int:item_id>', methods=['POST'])
@require_login
def toggle_item(item_id):
    """Toggle completion status of an item"""
    item = ChecklistItem.query.join(Checklist).filter(
        ChecklistItem.id == item_id,
        Checklist.user_id == current_user.id
    ).first()
    
    if not item:
        flash('Item não encontrado!', 'error')
        return redirect(url_for('home'))
    
    item.completed = not item.completed
    db.session.commit()
    
    return redirect(url_for('home'))

@app.route('/delete_item/<int:item_id>', methods=['POST'])
@require_login
def delete_item(item_id):
    """Delete an item from a checklist"""
    item = ChecklistItem.query.join(Checklist).filter(
        ChecklistItem.id == item_id,
        Checklist.user_id == current_user.id
    ).first()
    
    if not item:
        flash('Item não encontrado!', 'error')
        return redirect(url_for('home'))
    
    db.session.delete(item)
    db.session.commit()
    
    flash('Item excluído com sucesso! 🗑️', 'success')
    return redirect(url_for('home'))

@app.route('/edit_checklist/<int:checklist_id>', methods=['POST'])
@require_login
def edit_checklist(checklist_id):
    """Edit checklist name and color"""
    checklist = Checklist.query.filter_by(id=checklist_id, user_id=current_user.id).first()
    
    if not checklist:
        flash('Lista não encontrada!', 'error')
        return redirect(url_for('home'))
    
    new_name = request.form.get('name', '').strip()
    new_color = request.form.get('color', checklist.color)
    
    if not new_name:
        flash('Por favor, digite um nome para a lista!', 'error')
        return redirect(url_for('home'))
    
    # Validate color
    allowed_colors = ['pink', 'purple', 'blue', 'green', 'yellow']
    if new_color not in allowed_colors:
        new_color = checklist.color
    
    checklist.name = new_name
    checklist.color = new_color
    db.session.commit()
    
    flash('Lista atualizada com sucesso! ✨', 'success')
    return redirect(url_for('home'))
