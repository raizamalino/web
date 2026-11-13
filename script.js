// Roamora - shared JavaScript
var cars = [
  {id:1, name:"Zippy Mini",     type:"Compact", seats:4,  price:1500, icon:"🚗", page:"product-details.html"},
  {id:2, name:"City Hopper",    type:"Compact", seats:5,  price:1800, icon:"🚙", page:"product-details.html"},
  {id:3, name:"Trail Boss",     type:"SUV",     seats:7,  price:3200, icon:"🚙", page:"product-details2.html"},
  {id:4, name:"Summit X",       type:"SUV",     seats:5,  price:2800, icon:"🛻", page:"product-details2.html"},
  {id:5, name:"Family Cruiser", type:"Van",     seats:10, price:4000, icon:"🚐", page:"product-details.html"},
  {id:6, name:"Group Glide",    type:"Van",     seats:12, price:4500, icon:"🚌", page:"product-details2.html"}
];

function getCart(){
  try { return JSON.parse(localStorage.getItem("roamoraCart")) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  try { localStorage.setItem("roamoraCart", JSON.stringify(cart)); } catch(e){}
  updateCount();
}
function updateCount(){
  var el = document.getElementById("count");
  if(el) el.textContent = getCart().length;
}
function addToCart(id){
  var daysBox = document.getElementById("days");
  var days = daysBox ? parseInt(daysBox.value) || 1 : 1;
  var cart = getCart();
  var found = cart.find(function(c){ return c.id === id; });
  if(found){ found.days = days; } else { cart.push({id:id, days:days}); }
  saveCart(cart);
  alert("Added to cart!");
}

// Show cars in a grid (used by index.html and product.html)
function showCars(filter, limit){
  var box = document.getElementById("list");
  if(!box) return;
  var list = cars.filter(function(c){ return !filter || filter === "all" || c.type === filter; });
  if(limit) list = list.slice(0, limit);
  box.innerHTML = list.map(function(c){
    return '<div class="card"><div class="emoji">'+c.icon+'</div><h3>'+c.name+'</h3>' +
      '<small>'+c.type+' · '+c.seats+' seats</small>' +
      '<div class="price">₱'+c.price.toLocaleString()+' / day</div>' +
      '<a class="btn alt" href="'+c.page+'">Details</a> ' +
      '<button class="btn" onclick="addToCart('+c.id+')">Add</button></div>';
  }).join("");
}

// Cart page
function showCart(){
  var box = document.getElementById("cartBox");
  if(!box) return;
  var cart = getCart();
  if(cart.length === 0){
    box.innerHTML = "<p>Your cart is empty. <a href='product.html'>Browse cars</a></p>";
    return;
  }
  var total = 0;
  var rows = cart.map(function(item, i){
    var c = cars.find(function(x){ return x.id === item.id; });
    var sub = c.price * item.days;
    total += sub;
    return "<tr><td>"+c.icon+" "+c.name+"</td><td>₱"+c.price.toLocaleString()+"</td>" +
      "<td><input type='number' min='1' value='"+item.days+"' style='width:60px' onchange='changeDays("+i+",this.value)'></td>" +
      "<td>₱"+sub.toLocaleString()+"</td>" +
      "<td><button class='btn alt' onclick='removeItem("+i+")'>Remove</button></td></tr>";
  }).join("");
  box.innerHTML = "<table><tr><th>Car</th><th>Price/day</th><th>Days</th><th>Subtotal</th><th></th></tr>"+rows+"</table>" +
    "<div class='total'>Total: ₱"+total.toLocaleString()+"</div>" +
    "<button class='btn' onclick='checkout()'>Checkout</button>";
}
function changeDays(i, v){
  var cart = getCart();
  cart[i].days = Math.max(1, parseInt(v) || 1);
  saveCart(cart); showCart();
}
function removeItem(i){
  var cart = getCart();
  cart.splice(i, 1);
  saveCart(cart); showCart();
}
function checkout(){
  alert("Thank you! Your booking is received (demo only).");
  saveCart([]); showCart();
}

updateCount();