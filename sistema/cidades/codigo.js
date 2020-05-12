var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists Cidades (IdCidade int unique, Descricao text, Uf text)',
		[],
		function (tx) {
			mostrarCidades();				
		},
		seDerErro);
	});	
}

function mostrarCidades() {
	novoIdCidade();
	banco.transaction(function (tx) {
		tx.executeSql('select * from Cidades ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaCidades = document.getElementById('listaCidades');
			
			listaCidades.innerHTML = "";
			
			novoIdCidade();
			
			var i;
			var item = null;
			
			document.getElementById('descricao').value = "";
			document.getElementById('uf').value = "";
			
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">Nº</th>        	 ' +
						'	<th class="">Cidade</th>                     ' +
						'	<th class="">UF</th>                         ' +
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
						
				
				linhas = linhas + '<tr onclick="alterarCidade('+item['IdCidade']+')" >   ' +
								'<td class="center-align">' + item['IdCidade'] +' </td>  ' +
								'<td class="">            ' + item['Descricao']+' </td>         ' +
								'<td class="">            ' + item['Uf']+' </td>         ' +
								'</tr>                                                   ';				  
			}
			listaCidades.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	if (document.getElementById('descricao').value == "") {
		var $toastContent = $('<span>Preencha o Campo Nome!</span>');
        Materialize.toast($toastContent, 5000);
		return false;			
	} else {
		return true;	
	}
}

function novoCidade() {	
	novoIdCidade();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idCidade  = document.getElementById('idCidade').value;
			var Descricao = document.getElementById('descricao').value;
			var UF        = document.getElementById('uf').value;
					
			
			Descricao = Descricao.toUpperCase();
			UF        = UF.toUpperCase();
		
			tx.executeSql('insert into Cidades (IdCidade, Descricao, UF) values (?,?,?)',
			[idCidade, Descricao, UF],
			
			function (tx) {; 
				mostrarCidades(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdCidade() {
	banco.transaction(function (tx) {
		var idCidade = document.getElementById('idCidade');
	
	    texto = 'select MAX(IdCidade) Id from Cidades'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idCidade.value = item['Id'] + 1 ; 
			} else {
				idCidade.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaCidade() {
	var idCidade  = document.getElementById('idCidade').value;
	var Descricao = document.getElementById('descricao').value;
	var UF        = document.getElementById('uf').value;
			
	
	Descricao = Descricao.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update Cidades set Descricao = ?, UF = ?  where IdCidade = ?', 
	[Descricao, UF, idCidade], 
	function (tx, results) {
		mostrarCidades();	
	}, 
		seDerErro);
	});
}

function excluiCidade() {
	var IdCidade = document.getElementById('idCidade').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from Cidades where IdCidade = ?', 
	[IdCidade], 
	function (tx, results) {
		mostrarCidades();
		novoIdCidade();		
	}, 
		seDerErro);
	});
}

function alterarCidade(IdCidade) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from Cidades where IdCidade = ?',
		[IdCidade],
		function (tx, results) {
			var item = results.rows.item(0);
			
			
			var idCidade  = document.getElementById('idCidade');
			var Descricao = document.getElementById('descricao');
			var UF        = document.getElementById('uf');
			
			idCidade.value    = IdCidade;
            Descricao.value = item['Descricao'];   
            UF.value        = item['Uf'];   
            
			
		},	
		seDerErro);
	});
	
}
