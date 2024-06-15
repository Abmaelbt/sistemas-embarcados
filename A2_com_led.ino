#include <NewPing.h>

#define TRIGGER_PIN 7  // Pino Trigger do sensor ultrassônico
#define ECHO_PIN 6     // Pino Echo do sensor ultrassônico
#define MAX_DISTANCE 200  // Distância máxima para o sensor ultrassônico

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // Inicializa o sensor ultrassônico

int buzzerPin = 9;  // Pino para o buzzer
int ledPin = 10;    // Pino para o LED
int minDistance = 5;  // Distância mínima para acionar o buzzer
int btnIncrease = 2;  // aumentar distância
int btnDecrease = 3;  // diminuir distância

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);           // Configura o pino do LED como saída
  pinMode(btnDecrease, INPUT);  // Usando resistor pull-down
  pinMode(btnIncrease, INPUT);  // Usando resistor pull-down
  Serial.begin(9600);
}

void loop() {
  // Ler a distância medida pelo sensor ultrassônico
  int distance = sonar.ping_cm();
  Serial.print("Distancia medida: ");
  Serial.println(distance);

  //Serial.print("Nível: ");
  //Serial.println(digitalRead(2));

  delay(100);  // delay de 100 ms após cada leitura do sensor

  if (distance > 0 && distance <= minDistance) {
    digitalWrite(buzzerPin, HIGH);  // Acionar o buzzer
    digitalWrite(ledPin, HIGH);    // Acender o LED
  } else {
    digitalWrite(buzzerPin, LOW);  // Desligar o buzzer
    digitalWrite(ledPin, LOW);     // Desligar o LED
  }

  bool changed = false;

  if (digitalRead(btnDecrease) == HIGH) {
    minDistance = max(1, minDistance - 1);  // Diminuir distância mínima
    changed = true; 
    delay(150);  // 
  }

  // Verificar se o botão para aumentar foi pressionado
  if (digitalRead(btnIncrease) == HIGH) {
    minDistance = min(100, minDistance + 1);  // Aumentar distância mínima
    changed = true; 
    delay(150);  // 
  }

  if (changed) {
    Serial.print("minDistance: ");
    Serial.println(minDistance); 
  }
}
