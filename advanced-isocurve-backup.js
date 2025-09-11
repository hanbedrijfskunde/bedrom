// AdvancedIsoProfitSimulator Class - based on example-isocurves.html
// Backup van slide 13 implementatie - niet gebruikt in slides-wk3.html

class AdvancedIsoProfitSimulator {
	constructor(slideNumber) {
		this.slideNumber = slideNumber;
		this.chart = null;
		this.canvas = document.getElementById(`advanced-isoprofit-chart-slide-${slideNumber}`);
		this.profitInput = document.getElementById(`profit-input-${slideNumber}`);
		this.profitDisplay = document.getElementById(`profit-display-${slideNumber}`);
		this.minQtyInput = document.getElementById(`min-qty-${slideNumber}`);
		this.maxQtyInput = document.getElementById(`max-qty-${slideNumber}`);
		this.rangeDisplay = document.getElementById(`range-display-${slideNumber}`);
		
		this.initializeChart();
		this.bindEvents();
		this.updateDisplay();
	}

	// Average Cost function (U-shaped curve) for croissant production
	averageCost(quantity) {
		const a = 0.0002; // Very small coefficient for croissant scale
		const h = 300; // Optimal quantity for minimum cost (economies of scale)
		const k = 0.9; // Minimum average cost in euros
		return a * Math.pow(quantity - h, 2) + k;
	}

	// Generate isoprofit curve data points
	generateIsoprofitCurve(profitLevel, minQuantity, maxQuantity) {
		const isoprofitPoints = [];
		for (let q = minQuantity; q <= maxQuantity; q += 5) {
			if (q === 0) continue;
			const ac = this.averageCost(q);
			const p = profitLevel / q + ac;
			if (p > 0 && p <= 6) { // Croissant price range €0-6
				isoprofitPoints.push({ x: q, y: p });
			}
		}
		return isoprofitPoints;
	}

	initializeChart() {
		const ctx = this.canvas.getContext('2d');
		
		// Create empty chart with proper labels structure
		this.chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [], // Will be populated with quantity values
				datasets: [
					{
						label: 'Isowinstcurve',
						data: [],
						borderColor: 'rgb(52, 152, 219)',
						backgroundColor: 'rgba(52, 152, 219, 0.1)',
						borderWidth: 2,
						tension: 0.1,
						pointRadius: 0,
						fill: false
					},
					{
						label: 'Average Cost Curve (Zero-Profit)',
						data: [],
						borderColor: 'rgb(231, 76, 60)',
						backgroundColor: 'rgba(231, 76, 60, 0.1)',
						borderWidth: 2,
						borderDash: [5, 5],
						tension: 0.1,
						pointRadius: 0,
						fill: false
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						title: { display: true, text: 'Hoeveelheid croissants' },
						min: 0,
						max: 500
					},
					y: {
						title: { display: true, text: 'Prijs per croissant (€)' },
						min: 0,
						max: 6
					}
				},
				plugins: {
					legend: { display: true },
					tooltip: {
						callbacks: {
							title: function(context) {
								return `Hoeveelheid: ${context[0].parsed.x}`;
							},
							label: function(context) {
								let label = context.dataset.label || '';
								if (label) label += ': ';
								label += `€${parseFloat(context.parsed.y).toFixed(2)}`;
								return label;
							}
						}
					}
				}
			}
		});
	}

	bindEvents() {
		this.profitInput.addEventListener('input', () => this.updateDisplay());
		this.minQtyInput.addEventListener('input', () => this.updateDisplay());
		this.maxQtyInput.addEventListener('input', () => this.updateDisplay());
	}

	updateDisplay() {
		const profitLevel = parseFloat(this.profitInput.value);
		const minQty = parseInt(this.minQtyInput.value);
		const maxQty = parseInt(this.maxQtyInput.value);

		// Update displays
		this.profitDisplay.textContent = profitLevel.toLocaleString();
		this.rangeDisplay.textContent = `${minQty}-${maxQty}`;

		// Generate data in correct Chart.js format
		const isoprofitData = this.generateIsoprofitCurve(profitLevel, minQty, maxQty);
		const zeroProfitData = this.generateIsoprofitCurve(0, minQty, maxQty); // AC curve

		// Update chart labels and data - following example-isocurves.html pattern
		this.chart.data.labels = isoprofitData.map(d => d.x); // x-values as labels
		this.chart.data.datasets[0].data = isoprofitData.map(d => d.y); // y-values only
		this.chart.data.datasets[0].label = `Isowinstcurve (€${profitLevel.toLocaleString()} winst)`;
		this.chart.data.datasets[1].data = zeroProfitData.map(d => d.y); // y-values only

		this.chart.update('none');
	}
}

// Corresponding HTML for slide 13:
/*
<section class="slide h-full flex-col items-center justify-center">
	<div class="slide-content">
		<h2 class="text-3xl md:text-4xl font-bold text-center">
			📊 Verbeterde Isowinstcurves Visualisatie
		</h2>
		<p class="mt-2 text-lg sm:text-xl text-gray-600 text-center">
			Gebaseerd op realistische kostenstructuren met U-vormige average cost curve
		</p>
		<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-white p-6 rounded-lg shadow-md">
				<canvas id="advanced-isoprofit-chart-slide-13" width="400" height="300"></canvas>
			</div>
			<div class="bg-gray-50 p-6 rounded-lg">
				<div class="space-y-4">
					<div>
						<label for="profit-input-13" class="block text-sm font-medium text-gray-700 mb-2">Gewenst winstniveau: €<span id="profit-display-13">200</span></label>
						<input id="profit-input-13" type="range" min="0" max="1000" step="50" value="200" 
							class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
					</div>
					<div>
						<label for="quantity-range-13" class="block text-sm font-medium text-gray-700 mb-2">Hoeveelheid bereik: <span id="range-display-13">50-450</span> croissants</label>
						<div class="flex space-x-2">
							<input id="min-qty-13" type="number" min="10" max="200" value="50" 
								class="w-20 px-2 py-1 border rounded text-sm">
							<input id="max-qty-13" type="number" min="200" max="500" value="450" 
								class="w-20 px-2 py-1 border rounded text-sm">
						</div>
					</div>
					<div class="mt-4 p-4 bg-blue-100 rounded-lg text-sm">
						<h4 class="font-bold mb-2">💡 Wat toont deze grafiek:</h4>
						<ul class="space-y-1 text-xs">
							<li>🔵 <strong>Blauwe curve:</strong> Isowinstcurve voor gekozen winstniveau</li>
							<li>🔴 <strong>Rode gestippelde lijn:</strong> Average Cost curve (U-vorm, economies of scale)</li>
							<li>📐 <strong>Formule:</strong> Prijs = Winst/Hoeveelheid + GemiddeldeKosten(Q)</li>
							<li>🎯 <strong>Optimaal:</strong> Laagste punt op AC curve = meest efficiënte schaal</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
*/

// Initialization code (also remove from main file):
/*
if (index === 12 && !advancedIsoProfitSimulatorInitialized) {
	new AdvancedIsoProfitSimulator(13);
	advancedIsoProfitSimulatorInitialized = true;
}
*/