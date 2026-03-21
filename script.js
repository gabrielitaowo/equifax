var clientsDB = {
    '0502982549': {
        codigo: '2549',
        nombre: 'HEREDIA CATOTA MARCO VINICIO',
        cedula: '0502982549',
        score: 897
    },
    '0802148635': {
        codigo: '8635',
        nombre: 'TANDAZO REGALADO PATRICIO ALEXANDER',
        cedula: '0802148635',
        score: 905
    },
    '0803575380': {
        codigo: '5380',
        nombre: 'ZURITA MEDRANO JHONNY ALBERTO',
        cedula: '0803575380',
        score: 893
    },

    '1234567890': {
        codigo: '1234',
        nombre: 'Franco Fernández',
        usuario: 'Franco',
        cedula: '1234567890',
        score: 893
    },
    '0987654321': {
        codigo: '4321',              // este es el "contraseña" o código de acceso
        nombre: 'Ana Pérez',         // nombre completo
        usuario: 'Ana',              // nombre de usuario opcional
        cedula: '0987654321',        // cédula o identificador
        score: 900                   // puntaje que quieras asignar
    },
    '1725531493': {
        codigo: '1725',              
        nombre: 'María Fernanda Espinoza Espinoza',         
        usuario: '1725531493',              
        cedula: '1725531493',        
        score: 900                   
    }
};

var currentUser = null;
var countdownTimer = null;
var timeRemaining = 1200;

function handleLogin() {
    var inputUser = document.getElementById('cedula').value.trim(); // ahora este campo puede ser usuario o cédula
    var codigo = document.getElementById('codigo').value.trim();

    if (!inputUser || !codigo) {
        alert('Por favor ingresa tu usuario o cédula y el código');
        return;
    }

    var client = clientsDB[inputUser];

    if (!client) {
        for (var key in clientsDB) {
            if (clientsDB[key].usuario && clientsDB[key].usuario.toLowerCase() === inputUser.toLowerCase()) {
                client = clientsDB[key];
                break;
            }
        }
    }

    if (!client) {
        alert('Usuario o cédula no encontrado');
        return;
    }

    if (client.codigo !== codigo) {
        alert('Código incorrecto');
        return;
    }

    currentUser = client;
    showDashboard();
}



function showDashboard() {

    document.getElementById('pdfUserName').textContent = currentUser.nombre;
    document.getElementById('pdfUserCI').textContent = currentUser.cedula;
    document.getElementById('pdfUserScore').textContent = currentUser.score;

    var now = new Date();
    document.getElementById('pdfDate').textContent = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    document.getElementById('pdfTime').textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('pdfUserScoreMini').textContent = currentUser.score;


    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').style.display = 'block';

    var now = new Date();
    var dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    var timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    var scoreDateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('currentTime').textContent = timeStr;
    document.getElementById('userName').textContent = currentUser.nombre;
    document.getElementById('userCI').textContent = currentUser.cedula;
    document.getElementById('scoreBig').textContent = currentUser.score;
    document.getElementById('scoreGauge').textContent = currentUser.score;
    document.getElementById('scoreDate').textContent = scoreDateStr;

    startCountdown();
}

function startCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    timeRemaining = 1200;

    function updateTimer() {
        var mins = Math.floor(timeRemaining / 60);
        var secs = timeRemaining % 60;

        document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
        document.getElementById('seconds').textContent = String(secs).padStart(2, '0');

        if (timeRemaining <= 0) {
            clearInterval(countdownTimer);
            alert('Tiempo agotado! Tu sesion ha expirado.');
            handleLogout();
            return;
        }

        if (timeRemaining <= 300) {
            document.getElementById('timerBox').style.background = 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)';
        }

        timeRemaining--;
    }

    updateTimer();
    countdownTimer = setInterval(updateTimer, 1000);
}

function handleLogout() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        location.reload();
    }

    currentUser = null;
    timeRemaining = 1200;

    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('cedula').value = '';
    document.getElementById('codigo').value = '';
    location.reload();
}

function downloadReport() {
    alert('📄 Para descargar el PDF:\n\n1. Usa Ctrl+P (o Cmd+P en Mac)\n2. Selecciona "Guardar como PDF"\n3. Haz clic en Guardar\n\nNombre: ' + currentUser.nombre + '\nScore: ' + currentUser.score);

    window.print();

    document.body.innerHTML = `
        <div class="report-wrapper">
        <div class="report-card">
            <h1 class="report-title">📄 Reporte Generado</h1>
            
            <p class="report-info">
                <strong>Nombre:</strong> ${currentUser.nombre}<br>s
                <strong>Cédula:</strong> ${currentUser.cedula}<br>
                <strong>Score:</strong> ${currentUser.score} puntos
            </p>
            
            <p class="report-message">
                El reporte ha sido procesado correctamente.<br>
                Gracias por usar el sistema.
            </p>
            <button class="pdf-logout" onclick="handleLogout()">Cerrar Sesión</button>
        </div>
    </div>
    `;

}

document.getElementById('cedula').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('codigo').focus();
    }
});

document.getElementById('codigo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleLogin();
    }
});
