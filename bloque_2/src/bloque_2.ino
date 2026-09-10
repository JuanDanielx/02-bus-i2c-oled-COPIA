// ============================================================================
// UETS SOPORTE TÉCNICO — SEMANA 02 — BLOQUE 2: INICIALIZACIÓN OLED & CABECERA
// 3° Bachillerato Técnico en Informática (2026–2027)
// ============================================================================

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET_PIN -1
#define OLED_I2C_ADDR 0x3C
#define SERIAL_BAUD 115200

// Instanciación del objeto display con sus 4 parámetros:
// (Ancho, Alto, Puntero al Bus Wire, Pin de Reset)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET_PIN);

void setup()
{
    Serial.begin(SERIAL_BAUD);
    delay(1000);
    Serial.println("\n[BLOQUE 2] Inicializando Pantalla OLED SSD1306...");

    // Inicializamos el bus I2C en los pines por defecto del ESP32 (SDA=21, SCL=22)
    Wire.begin(21, 22);

    // TODO 2.1: Arrancar la pantalla activando la bomba de carga interna (charge pump)
    // pasando la constante SSD1306_SWITCHCAPVCC y la dirección 0x3C.
    // Pregunta Guía: ¿Qué hace la bomba de carga con el voltaje de 3.3V?
    // if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
    //     Serial.println("[OLED] ❌ ERROR: Pantalla no detectada en 0x3C.");
    //     while (true); // Detiene la ejecución si hay falla física
    // }
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR))
    {
        Serial.println("[OLED] ❌ ERROR: Pantalla no detectada en 0x3C.");
        while (true)
            ; // Detiene la ejecución si hay falla física
    }

    Serial.println("[OLED] Pantalla SSD1306 inicializada [OK]");

    // TODO 2.2: Construir la cabecera visual en el buffer RAM:
    // 1. Limpiar el cuaderno borrador en RAM con display.clearDisplay();
    // 2. Definir color blanco con display.setTextColor(SSD1306_WHITE);
    // 3. Definir tamaño de letra 1 con display.setTextSize(1);
    // 4. Ubicar el cursor en (X=8, Y=0) con display.setCursor(8, 0);
    // 5. Escribir el título: display.println(">> ESP32 SISTEMA <<");
    // 6. Trazar una línea horizontal en Y=10: display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
    /* ESCRIBE TU CÓDIGO AQUÍ */
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    display.setTextSize(1);
    display.setCursor(8, 0);
    display.println(">> ESP32 SISTEMA <<");
    display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
    // TODO 2.3: ¡LA ORDEN MÁGICA!
    // Pregunta Clave: Si solo escribiste en la memoria RAM, ¿por qué la pantalla sigue negra?
    // ¿Qué orden vuelca el buffer hacia los píxeles físicos del vidrio?
    // display.display();
    display.display();

    Serial.println("[OLED] Cabecera visual renderizada exitosamente.");
}

void loop()
{
    delay(1000);
}
