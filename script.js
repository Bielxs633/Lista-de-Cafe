document.addEventListener("DOMContentLoaded", () => {
    const coffeeContainer = document.getElementById("coffee-container");
    const categoryFilter = document.getElementById("category");
    const searchInput = document.getElementById("search");
    let coffeeData = [];

    const translationDictionary = {
        "coffee": "café",
        "milk": "leite",
        "sugar": "açúcar",
        "cream": "creme",
        "strong": "forte",
        "sweet": "doce",
        "bitter": "amargo",
        "smooth": "suave",
        "rich": "rico",
        "flavor": "sabor",
        "vanilla": "baunilha",
        "caramel": "caramelo",
        "chocolate": "chocolate",
        "espresso": "expresso",
        "mocha": "moca",
        "cinnamon": "canela",
        "hazelnut": "avelã"
    };

    function translateDescription(description) {
        return description.split(" ").map(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
            return translationDictionary[cleanWord] || word;
        }).join(" ");
    }

    async function fetchCoffees() {
        try {
            const response = await fetch("https://api.sampleapis.com/coffee/hot");
            coffeeData = await response.json();
            console.log(coffeeData); // Verificar os dados recebidos
            coffeeData.forEach(coffee => {
                coffee.translatedDescription = translateDescription(coffee.description);
            });
            populateCategories();
            displayCoffees(coffeeData);
        } catch (error) {
            console.error("Erro ao buscar dados da API", error);
        }
    }

    function displayCoffees(coffees) {
        coffeeContainer.innerHTML = "";
        coffees.forEach(coffee => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${coffee.image}" alt="${coffee.title}">
                <h2>${coffee.title}</h2>
                <p>${coffee.translatedDescription}</p>
            `;
            coffeeContainer.appendChild(card);
        });
    }

    function populateCategories() {
        const categories = new Set(coffeeData.map(coffee => coffee.title.split(" ")[0])); // Usa a primeira palavra do título como categoria
        categoryFilter.innerHTML = '<option value="all">Todas</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        const filteredCoffees = selectedCategory === "all" 
            ? coffeeData 
            : coffeeData.filter(coffee => coffee.title.startsWith(selectedCategory));
        displayCoffees(filteredCoffees);
    });

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCoffees = coffeeData.filter(coffee => 
            coffee.title.toLowerCase().includes(searchTerm) ||
            coffee.translatedDescription.toLowerCase().includes(searchTerm)
        );
        displayCoffees(filteredCoffees);
    });

    fetchCoffees();
});