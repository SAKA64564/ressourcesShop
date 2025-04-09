"use strict"

// Tableau des éléments de la boutique
const items = [
	{
		id: 1,
		price: 150,
		description: "Table de cuisine bois naturel",
		image: "img/image1.jpg"
	},
	{
		id: 2,
		price: 220,
		description: "Table de cuisine blanc",
		image: "img/image2.jpg"
	},
	{
		id: 3,
		price: 280,
		description: "Table basse de salon",
		image: "img/image3.jpg"
	},
	{
		id: 4,
		price: 170,
		description: "Table de salon",
		image: "img/image4.jpg"
	},
	{
		id: 5,
		price: 210,
		description: "Table à hauteur réglable",
		image: "img/image5.jpg"
	},
	{
		id: 6,
		price: 90,
		description: "Table ronde",
		image: "img/image6.jpg"
	}
];

let listeEnvies = [];
let listeAchats = [];

function chargerDonnees() {
    const enviesStockees = localStorage.getItem('listeEnvies');
    if (enviesStockees) {
        listeEnvies = JSON.parse(enviesStockees);
    }
  
    const achatsStockes = localStorage.getItem('listeAchats');
    if (achatsStockes) {
        listeAchats = JSON.parse(achatsStockes);
    }
}

function sauvegarderDonnees() {
    localStorage.setItem('listeEnvies', JSON.stringify(listeEnvies));
    localStorage.setItem('listeAchats', JSON.stringify(listeAchats));
}

function refresh() {
    const shopElement = document.getElementById('shop');
    shopElement.innerHTML = '';
    
    items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'element';
        element.innerHTML = `
            <img src="${item.image}" alt="${item.description}">
            <h2>${item.description}</h2>
            <p class="price">${item.price} €</p>
            <button class="btn btnCart" data-id="${item.id}"><i class="fas fa-shopping-cart"></i> Ajouter au panier</button>
            <a href="#" class="envie" data-id="${item.id}"><i class="fa-solid fa-heart"></i> Ajouter à ma liste d'envies</a>
        `;
        shopElement.appendChild(element);
    });
    
    const btnCarts = document.querySelectorAll('.btnCart');
    btnCarts.forEach(btn => {
        btn.addEventListener('click', ajoutPanier);
    });
    
    const btnEnvies = document.querySelectorAll('.envie');
    btnEnvies.forEach(btn => {
        btn.addEventListener('click', ajoutListeEnvies);
    });
}

// Fonction pour trier les éléments par prix croissant
function triCroissant() {
    items.sort((a, b) => a.price - b.price);
    refresh();
}

// Fonction pour trier les éléments par prix décroissant
function triDecroissant() {
    items.sort((a, b) => b.price - a.price);
    refresh();
}

//
// GESTION DE LA LISTE D'ENVIES
//

function ajoutListeEnvies(event) {
    event.preventDefault();
    const id = parseInt(event.currentTarget.getAttribute('data-id'));

    if (!listeEnvies.includes(id)) {
        listeEnvies.push(id);
        sauvegarderDonnees();
        afficherListeEnvies();
    }
}

function afficherListeEnvies() {
    const listeElement = document.getElementById('liste');
    
    const btnViderListe = document.getElementById('btnViderListe');
    
    if (listeEnvies.length === 0) {
        listeElement.innerHTML = '<p class="status">La liste est vide</p>';
        btnViderListe.style.display = 'none';
    } else {
        listeElement.innerHTML = '';
        btnViderListe.style.display = 'block';
        
        listeEnvies.forEach(id => {
            const item = items.find(item => item.id === id);
            const element = document.createElement('div');
            element.innerHTML = `
                <p>${item.description} - ${item.price} €</p>
            `;
            listeElement.appendChild(element);
        });
    }
}

function viderListe() {
    listeEnvies = [];
    sauvegarderDonnees();
    afficherListeEnvies();
}


function ajoutPanier(event) {
    const id = parseInt(event.currentTarget.getAttribute('data-id'));

    listeAchats.push(id);
    sauvegarderDonnees();
    afficherPanier();
}

function afficherPanier() {
    const panierElement = document.getElementById('cart');
    
    if (listeAchats.length === 0) {
        panierElement.textContent = 'Le panier est vide';
    } else {
        let total = 0;
        let nbArticles = listeAchats.length;
        
        listeAchats.forEach(id => {
            const item = items.find(item => item.id === id);
            total += item.price;
        });
        
        panierElement.textContent = `${nbArticles} article${nbArticles > 1 ? 's' : ''} - Total: ${total} €`;
    }
}

function viderPanier() {
    listeAchats = [];
    sauvegarderDonnees();
    afficherPanier();
}


document.addEventListener('DOMContentLoaded', function () {
    chargerDonnees();
    
    refresh();

    document.getElementById('croissant').addEventListener('click', triCroissant);
    document.getElementById('decroissant').addEventListener('click', triDecroissant);
    document.getElementById('btnViderListe').addEventListener('click', viderListe);
    
    document.getElementById('cart').addEventListener('click', function() {
        if (listeAchats.length > 0 && confirm('Voulez-vous vider votre panier ?')) {
            viderPanier();
        }
    });
    
    afficherListeEnvies();
    afficherPanier();
});