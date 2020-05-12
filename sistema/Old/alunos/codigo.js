var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProFacul','1.0','Sistema Para Comissoes de Formatura', 2 * 1024 * 1024);
	
	criaTabela();
}
	
function criaTabela() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TAlunos (IdAluno int unique, Nome text, Ativo text, Comissao, text)',
		[],
		function (tx) {
			mostrarAlunos();				
		},
		seDerErro);
	});	
}

function mostrarAlunos() {
	novoIdAluno();
	banco.transaction(function (tx) {
		tx.executeSql('select * from TAlunos ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaAlunos = document.getElementById('listaAlunos');
			
			listaAlunos.innerHTML = "";
			
			novoIdAluno();
			
			var i;
			var item = null;
			
			document.getElementById('nome').value = "";
			
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight ">    ' +
			            ' <tr>                          				 ' + 
						'	<th class="center-align">Nº</th>        	 ' +
						'	<th class="">Aluno</th>                      ' +
						'	<th class="">Ativo</th>                      ' +
						'	<th class="">Comissão</th>                      ' +
						' </tr>                                          ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Ativo']=='S') {
					item['Ativo'] = 'Sim'
				} else {
					item['Ativo'] = 'Não';
				}
				if (item['Comissao']=='S') {
					item['Comissao'] = 'Sim'
				} else {
					item['Comissao'] = 'Não'
				}
				
				
				linhas = linhas + '<tr onclick="alterarAluno('+item['IdAluno']+')" >       ' +
								'<td class="center-align">' + item['IdAluno'] +' </td>    ' +
								'<td class="">            ' + item['Nome']    +' </td>    ' +
								'<td class="">            ' + item['Ativo']   +' </td>    ' +
								'<td class="">            ' + item['Comissao']+' </td>    ' +
								'</tr>                                                    ';				  
			}
			listaAlunos.innerHTML += cabecalho + linhas + rodape; 
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

function novoAluno() {	
	novoIdAluno();
	
	if (validou()) {
	
		banco.transaction(function (tx) {
			var idAluno  = document.getElementById('idAluno').value;
			var Nome     = document.getElementById('nome').value;
			var Ativo    = 'N';
	        var Comissao = 'N';
	
			if (document.getElementById('ativo').checked) {
				 Ativo = 'S';
			}
			if (document.getElementById('comissao').checked) {
				 Comissao = 'S';
			}
			
			
			Nome = Nome.toUpperCase();
		
			tx.executeSql('insert into TAlunos (IdAluno, Nome, Ativo, Comissao) values (?,?,?,?)',
			[idAluno, Nome, Ativo, Comissao],
			
			function (tx) {; 
				mostrarAlunos(); 	
			},
			seDerErro);
		});	
	}	
}

function novoIdAluno() {
	banco.transaction(function (tx) {
		var idAluno = document.getElementById('idAluno');
	
	    texto = 'select MAX(IdAluno) Id from TAlunos'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				idAluno.value = item['Id'] + 1 ; 
			} else {
				idAluno.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function atualizaAluno() {
	var IdAluno  = document.getElementById('idAluno').value;
	var Nome     = document.getElementById('nome').value;
	var Ativo    = 'N';
	var Comissao = 'N';
	
	if (document.getElementById('ativo').checked) {
		 Ativo = 'S';
	}
	if (document.getElementById('comissao').checked) {
		 Comissao = 'S';
	}
	
	Nome = Nome.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TAlunos set Nome = ?, Ativo = ?, Comissao = ?  where IdAluno = ?', 
	[Nome, Ativo, Comissao, IdAluno], 
	function (tx, results) {
		mostrarAlunos();	
	}, 
		seDerErro);
	});
}

function excluiAluno() {
	var IdAluno = document.getElementById('idAluno').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TAlunos where IdAluno = ?', 
	[IdAluno], 
	function (tx, results) {
		mostrarAlunos();
		novoIdAluno();		
	}, 
		seDerErro);
	});
}

function alterarAluno(IdAluno) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TAlunos where IdAluno = ?',
		[IdAluno],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var Codigo   = document.getElementById('idAluno');
			var Nome     = document.getElementById('nome');
			var Ativo    = document.getElementById('ativo');
			var Comissao = document.getElementById('comissao');
			
			if (item['Ativo']=='S') {
				Ativo.checked = true;
			} else {
				Ativo.checked = false;
			}
			if (item['Comissao']=='S') {
				Comissao.checked = true;
			} else {
				Comissao.checked = false;
			}
			
			Codigo.value   = IdAluno;
            Nome.value     = item['Nome'];   
            
			
		},	
		seDerErro);
	});
	
}
