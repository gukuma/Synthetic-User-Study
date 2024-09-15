<script>
import Chatbot from "./Demo.svelte";
import {startconv} from "./stores";

let test ="";
startconv.subscribe(value => {
        if(value !=''){
		test = value;}
	});



</script>
<title>Synthetic User Study</title>

<meta name="description" content="">

<!--<Banner />

<Header />-->
<div class ="flex">


<Chatbot />

</div>
