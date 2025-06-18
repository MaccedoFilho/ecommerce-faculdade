document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const produtoCards = document.querySelectorAll('.produto-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    function filtrarProdutos() {
        const termoPesquisa = searchInput.value.toLowerCase().trim();
        let produtosEncontrados = false;
        
        produtoCards.forEach(card => {
            const nomeProduto = card.querySelector('.produto-nome').textContent.toLowerCase();
            const categoriaAtiva = document.querySelector('.category-btn.active').textContent.toLowerCase();
            
            const correspondeAoProduto = nomeProduto.includes(termoPesquisa);
            const correspondeACategoria = categoriaAtiva === 'todos' || 
                                          (categoriaAtiva === 'camisetas' && nomeProduto.includes('camiseta')) ||
                                          (categoriaAtiva === 'casacos' && (nomeProduto.includes('casaco') || nomeProduto.includes('moletom')));
            
            if (correspondeAoProduto && correspondeACategoria) {
                card.style.display = 'flex';
                produtosEncontrados = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        const mensagemNaoEncontrado = document.querySelector('.produtos-nao-encontrados');
        if (!produtosEncontrados) {
            if (!mensagemNaoEncontrado) {
                const mensagem = document.createElement('div');
                mensagem.className = 'produtos-nao-encontrados';
                mensagem.textContent = 'Nenhum produto encontrado para essa pesquisa.';
                mensagem.style.textAlign = 'center';
                mensagem.style.padding = '2rem';
                mensagem.style.width = '100%';
                mensagem.style.color = '#666';
                mensagem.style.fontSize = '1.1rem';
                
                const produtosGrid = document.querySelector('.produtos-grid');
                produtosGrid.appendChild(mensagem);
            }
        } else if (mensagemNaoEncontrado) {
            mensagemNaoEncontrado.remove();
        }
    }
    
    searchButton.addEventListener('click', filtrarProdutos);
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filtrarProdutos();
        }
    });
    
    searchInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(156, 39, 176, 0.2)';
        this.style.borderColor = '#9c27b0';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.boxShadow = 'none';
        this.style.borderColor = '#ddd';
    });
    
    searchButton.addEventListener('mouseenter', function() {
        this.style.color = '#9c27b0';
    });
    
    searchButton.addEventListener('mouseleave', function() {
        this.style.color = '#777';
    });
    
    let timeoutId;
    searchInput.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(filtrarProdutos, 300);
    });
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            filtrarProdutos();
        });
    });
    
    atualizarContadorCarrinho();
});

function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    
    notificacao.style.position = 'fixed';
    notificacao.style.bottom = '20px';
    notificacao.style.right = '20px';
    notificacao.style.backgroundColor = '#9c27b0';
    notificacao.style.color = 'white';
    notificacao.style.padding = '12px 20px';
    notificacao.style.borderRadius = '5px';
    notificacao.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    notificacao.style.zIndex = '1000';
    notificacao.style.opacity = '0';
    notificacao.style.transform = 'translateY(20px)';
    notificacao.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.opacity = '1';
        notificacao.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoHypeWear')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    let contador = document.querySelector('.cart-counter');
    
    if (totalItens > 0) {
        if (!contador) {
            contador = document.createElement('span');
            contador.className = 'cart-counter';
            
            contador.style.position = 'absolute';
            contador.style.top = '-8px';
            contador.style.right = '-8px';
            contador.style.backgroundColor = '#9c27b0';
            contador.style.color = 'white';
            contador.style.borderRadius = '50%';
            contador.style.width = '18px';
            contador.style.height = '18px';
            contador.style.fontSize = '12px';
            contador.style.display = 'flex';
            contador.style.alignItems = 'center';
            contador.style.justifyContent = 'center';
            
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.style.position = 'relative';
                cartIcon.appendChild(contador);
            }
        }
        
        contador.textContent = totalItens;
    } else if (contador) {
        contador.remove();
    }
}

window.adicionarAoCarrinho = function(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoHypeWear')) || [];
    
    const produtoExistente = carrinho.find(item => 
        item.id === produto.id && item.tamanho === produto.tamanho
    );
    
    if (produtoExistente) {
        produtoExistente.quantidade += produto.quantidade;
    } else {
        carrinho.push(produto);
    }
    
    localStorage.setItem('carrinhoHypeWear', JSON.stringify(carrinho));
    
    mostrarNotificacao('Produto adicionado ao carrinho!');
    
    atualizarContadorCarrinho();
};

window.removerDoCarrinho = function(id, tamanho) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoHypeWear')) || [];
    
    carrinho = carrinho.filter(item => !(item.id === id && item.tamanho === tamanho));
    
    localStorage.setItem('carrinhoHypeWear', JSON.stringify(carrinho));
    
    atualizarContadorCarrinho();
    
    return carrinho;
};
                                                                        
window.atualizarQuantidadeCarrinho = function(id, tamanho, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoHypeWear')) || [];
    
    carrinho = carrinho.map(item => {
        if (item.id === id && item.tamanho === tamanho) {
            item.quantidade = quantidade;
        }
        return item;
    });
    
    localStorage.setItem('carrinhoHypeWear', JSON.stringify(carrinho));
    
    atualizarContadorCarrinho();
    
    return carrinho;
};
