var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists Vendedores (IdVendedor int unique, Nome text, Uf text)',
		[],
		function (tx) {
			mostrarVendedores();				
		},
		seDerErro);
	});	
}

function mostrarVendedores() {
	novoIdVendedor();
	banco.transaction(function (tx) {
		tx.executeSql('select * from Vendedores ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaVendedores = document.getElementById('listaVendedores');
			
			listaVendedores.innerHTML = "";
			
			novoIdVendedor();
			
			var i;
			var item = null;
			
			document.getElementById('nome').value = "";
						
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">N</th>        	 ' +
						'	<th class="">Nome</th>                       ' +
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
						
				
				linhas = linhas + '<tr onclick="alterarVendedor('+item['IdVendedor']+')" > ' +
								'<td class="center-align">' + item['IdVendedor'] +' </td>  ' +
								'<td class="">            ' + item['Nome']+' </td>         ' +
								'</tr>                                                     ';				  
			}
			listaVendedores.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	if (document.getElementById('nome').value == "") {
		var $toastContent = $('<span>Preencha o Campo Nome!</span>');
        Materialize.toast($toastContent, 5000);
		return false;			
	} else {
		return true;	
	}
}

function novoVendedor() {	
	novoIdVendedor();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idVendedor  = document.getElementById('idVendedor').value;
			var Nome = document.getElementById('nome').value;
					
			
			Nome = Nome.toUpperCase();
			
			tx.executeSql('insert into Vendedores (IdVendedor, Nome) values (?,?)',
			[idVendedor, Nome],
			
			function (tx) {; 
				mostrarVendedores(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdVendedor() {
	banco.transaction(function (tx) {
		var idVendedor = document.getElementById('idVendedor');
	
	    texto = 'select MAX(IdVendedor) Id from Vendedores'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idVendedor.value = item['Id'] + 1 ; 
			} else {
				idVendedor.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaVendedor() {
	var idVendedor  = document.getElementById('idVendedor').value;
	var Nome = document.getElementById('nome').value;
			
	
	Nome = Nome.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update Vendedores set Nome = ?  where IdVendedor = ?', 
	[Nome, idVendedor], 
	function (tx, results) {
		mostrarVendedores();	
	}, 
		seDerErro);
	});
}

function excluiVendedor() {
	var IdVendedor = document.getElementById('idVendedor').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from Vendedores where IdVendedor = ?', 
	[IdVendedor], 
	function (tx, results) {
		mostrarVendedores();
		novoIdVendedor();		
	}, 
		seDerErro);
	});
}

function alterarVendedor(IdVendedor) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from Vendedores where IdVendedor = ?',
		[IdVendedor],
		function (tx, results) {
			var item = results.rows.item(0);
			
			
			var idVendedor  = document.getElementById('idVendedor');
			var Nome = document.getElementById('nome');
			
			idVendedor.value    = IdVendedor;
            Nome.value = item['Nome'];   
            
			
		},	
		seDerErro);
	});
	
}
