// Cute Checklists - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeAnimations();
    initializeFormValidation();
    initializeTooltips();
    initializeAutoSave();
    initializeKeyboardShortcuts();
});

// Smooth animations for various elements
function initializeAnimations() {
    // Animate checklist cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all checklist cards
    document.querySelectorAll('.checklist-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add bounce animation to completed items
    document.querySelectorAll('form[action*="toggle_item"] button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            if (this.querySelector('.fas.fa-check-circle')) {
                // Item is being unchecked
                this.style.animation = 'none';
            } else {
                // Item is being checked
                this.style.animation = 'bounce 0.6s ease';
            }
        });
    });
}

// Form validation and user feedback
function initializeFormValidation() {
    // Validate checklist creation form
    const newChecklistForm = document.querySelector('#newChecklistModal form');
    if (newChecklistForm) {
        newChecklistForm.addEventListener('submit', function(e) {
            const nameInput = this.querySelector('input[name="name"]');
            const name = nameInput.value.trim();
            
            if (name.length < 1) {
                e.preventDefault();
                showFeedback('Please enter a checklist name! 📝', 'error');
                nameInput.focus();
                return false;
            }
            
            if (name.length > 200) {
                e.preventDefault();
                showFeedback('Checklist name is too long! Please keep it under 200 characters. ✂️', 'error');
                nameInput.focus();
                return false;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
            submitBtn.disabled = true;
        });
    }

    // Validate item addition forms
    document.querySelectorAll('.add-item-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const input = this.querySelector('input[name="item_text"]');
            const text = input.value.trim();
            
            if (text.length < 1) {
                e.preventDefault();
                showFeedback('Please enter some text for the item! ✏️', 'error');
                input.focus();
                return false;
            }
            
            if (text.length > 500) {
                e.preventDefault();
                showFeedback('Item text is too long! Please keep it under 500 characters. ✂️', 'error');
                input.focus();
                return false;
            }
            
            // Visual feedback
            const button = this.querySelector('button[type="submit"]');
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // Reset after a short delay if form doesn't submit
            setTimeout(() => {
                if (button.disabled) {
                    button.innerHTML = originalIcon;
                    button.disabled = false;
                }
            }, 3000);
        });
    });

    // Real-time character counting for inputs
    document.querySelectorAll('input[name="name"], input[name="item_text"]').forEach(input => {
        const maxLength = input.name === 'name' ? 200 : 500;
        
        input.addEventListener('input', function() {
            const length = this.value.length;
            const remaining = maxLength - length;
            
            // Remove existing counter
            const existingCounter = this.parentNode.querySelector('.char-counter');
            if (existingCounter) {
                existingCounter.remove();
            }
            
            // Add character counter if approaching limit
            if (remaining < 50) {
                const counter = document.createElement('small');
                counter.className = `char-counter text-${remaining < 20 ? 'danger' : 'warning'} d-block mt-1`;
                counter.textContent = `${remaining} characters remaining`;
                this.parentNode.appendChild(counter);
            }
        });
    });
}

// Initialize Bootstrap tooltips for better UX
function initializeTooltips() {
    // Initialize tooltips on buttons and icons
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"], .btn[title], i[title]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            delay: { show: 500, hide: 100 }
        });
    });

    // Add helpful tooltips to various elements
    document.querySelectorAll('.color-circle').forEach(circle => {
        const color = circle.classList[1].replace('bg-', '');
        circle.setAttribute('title', `${color.charAt(0).toUpperCase() + color.slice(1)} theme`);
        new bootstrap.Tooltip(circle);
    });
}

// Auto-save functionality for forms
function initializeAutoSave() {
    let autoSaveTimeout;
    
    // Auto-save draft content for new checklist modal
    const nameInput = document.querySelector('#newChecklistModal input[name="name"]');
    if (nameInput) {
        // Load saved draft
        const savedName = localStorage.getItem('checklist_draft_name');
        if (savedName) {
            nameInput.value = savedName;
        }
        
        // Save drafts as user types
        nameInput.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                localStorage.setItem('checklist_draft_name', this.value);
            }, 1000);
        });
        
        // Clear draft when modal closes
        const modal = document.querySelector('#newChecklistModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function() {
                localStorage.removeItem('checklist_draft_name');
            });
        }
    }
}

// Keyboard shortcuts for power users
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N: New checklist
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const newChecklistBtn = document.querySelector('[data-bs-target="#newChecklistModal"]');
            if (newChecklistBtn) {
                newChecklistBtn.click();
                setTimeout(() => {
                    const nameInput = document.querySelector('#newChecklistModal input[name="name"]');
                    if (nameInput) nameInput.focus();
                }, 300);
            }
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
        
        // Enter in add item inputs: Submit form
        if (e.key === 'Enter' && e.target.matches('.add-item-form input')) {
            e.target.closest('form').submit();
        }
    });
}

// Enhanced user feedback system
function showFeedback(message, type = 'info') {
    // Remove existing feedback
    const existingAlert = document.querySelector('.dynamic-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show cute-alert dynamic-alert`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// Smooth page transitions
function initializePageTransitions() {
    // Add loading overlay for form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.matches('form:not(.add-item-form)')) {
            showLoadingOverlay();
        }
    });
}

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-heart fa-2x text-pink bounce"></i>
            <p class="mt-3">Making things cute...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Progress bar animations
function animateProgress() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 1s ease-in-out';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Initialize progress animations when cards come into view
function initializeProgressAnimations() {
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.checklist-card').forEach(card => {
        progressObserver.observe(card);
    });
}

// Enhanced item interaction
function initializeItemInteractions() {
    // Smooth checkbox animations
    document.querySelectorAll('form[action*="toggle_item"] button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Submit the form after animation
                this.closest('form').submit();
            }, 150);
        });
    });
}

// Color theme preview
function initializeColorPreview() {
    document.querySelectorAll('input[name="color"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const preview = modal.querySelector('.color-preview');
                if (!preview) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'color-preview mt-3 p-3 rounded';
                    previewDiv.textContent = 'Preview: Your checklist will look like this!';
                    this.closest('.mb-3').appendChild(previewDiv);
                }
                
                const previewEl = modal.querySelector('.color-preview');
                previewEl.className = `color-preview mt-3 p-3 rounded bg-${this.value}`;
            }
        });
    });
}

// Initialize all features
function initializeAllFeatures() {
    initializeAnimations();
    initializeFormValidation();
    initializeTooltips();
    initializeAutoSave();
    initializeKeyboardShortcuts();
    initializePageTransitions();
    initializeProgressAnimations();
    initializeItemInteractions();
    initializeColorPreview();
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllFeatures);
} else {
    initializeAllFeatures();
}

// Add loading overlay CSS
const loadingStyles = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

.loading-content {
    text-align: center;
    color: #666;
}
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Export functions for testing/debugging
window.CuteChecklists = {
    showFeedback,
    initializeAnimations,
    initializeFormValidation
};
