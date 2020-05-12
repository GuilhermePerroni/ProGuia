var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProFacul','1.0','Sistema Para Comissoes de Formatura', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TTipoCobranca (IdTipoCobranca int unique, Nome text, ValorPadrao double)',
		[],
		function (tx) {
		mostrarTipoCobranca();				
		},
		seDerErro);
	});	
}

function mostrarTipoCobranca() {
	novoIdTipoCobranca();
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoCobranca ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoCobranca = document.getElementById('listaTipoCobranca');
			
			listaTipoCobranca.innerHTML = "";
			
			novoIdTipoCobranca();
			
			var i;
			var item = null;
			
			document.getElementById('nomeTipoCobranca').value = "";
			document.getElementById('valorPadrao').value = "";
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">Nº</th>        	 ' +
						'	<th class="">Descrição</th>                  ' +
						'	<th class="">Valor Padrão</th>               ' +
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
			
				item['ValorPadrao'] = moeda(parseFloat(item['ValorPadrao']),2,'.','');
				
				linhas = linhas + '<tr onclick="alterarTipoCobranca('+item['IdTipoCobranca']+')" >       ' +
								'<td class="center-align">' + item['IdTipoCobranca'] +' </td>    ' +
								'<td class="">            ' + item['Nome']    +' </td>    ' +
								'<td class="">            ' + item['ValorPadrao']   +' </td>    ' +
								'</tr>                                                    ';				  
			}
			listaTipoCobranca.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function validou() {
	if ((document.getElementById('nomeTipoCobranca').value == "") || (document.getElementById('valorPadrao').value == "")) {
		var $toastContent = $('<span>Preencha todos os campos!</span>');
        Materialize.toast($toastContent, 5000);
		return false;			
	} else {
		return true;	
	}
}

function novoTipoCobranca() {	
	novoIdTipoCobranca();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idTipoCobranca   = document.getElementById('idTipoCobranca').value;
			var NomeTipoCobranca = document.getElementById('nomeTipoCobranca').value;
			var ValorPadrao      = document.getElementById('valorPadrao').value;
		
			if (ValorPadrao == "") {
				ValorPadrao = "0";				
			}
			
			NomeTipoCobranca = NomeTipoCobranca.toUpperCase();
		
			tx.executeSql('insert into TTipoCobranca (IdTipoCobranca, Nome, ValorPadrao) values (?,?,?)',
			[idTipoCobranca, NomeTipoCobranca, ValorPadrao],
			
			function (tx) {; 
				mostrarTipoCobranca(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdTipoCobranca() {
	banco.transaction(function (tx) {
		var idTipoCobranca = document.getElementById('idTipoCobranca');
	
	    texto = 'select MAX(IdTipoCobranca) Id from TTipoCobranca'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idTipoCobranca.value = item['Id'] + 1 ; 
			} else {
				idTipoCobranca.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaTipoCobranca() {
	var IdTipoCobranca   = document.getElementById('idTipoCobranca').value;
	var NomeTipoCobranca = document.getElementById('nomeTipoCobranca').value;
	var ValorPadrao      = document.getElementById('valorPadrao').value;
	
	
	NomeTipoCobranca = NomeTipoCobranca.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TTipoCobranca set Nome = ?, ValorPadrao = ?  where IdTipoCobranca = ?', 
	[NomeTipoCobranca, ValorPadrao, IdTipoCobranca], 
	function (tx, results) {
		mostrarTipoCobranca();	
	}, 
		seDerErro);
	});
}

function excluiTipoCobranca() {
	var IdTipoCobranca = document.getElementById('idTipoCobranca').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TTipoCobranca where IdTipoCobranca = ?', 
	[IdTipoCobranca], 
	function (tx, results) {
		mostrarTipoCobranca();
		novoIdTipoCobranca();		
	}, 
		seDerErro);
	});
}

function alterarTipoCobranca(IdTipoCobranca) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoCobranca where IdTipoCobranca = ?',
		[IdTipoCobranca],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var Codigo      = document.getElementById('idTipoCobranca');
			var Nome        = document.getElementById('nomeTipoCobranca');
			var ValorPadrao = document.getElementById('valorPadrao');
			
			Codigo.value      = IdTipoCobranca;
            Nome.value        = item['Nome']; 
            ValorPadrao.value = item['ValorPadrao'];			
            
			
		},	
		seDerErro);
	});
	
}
