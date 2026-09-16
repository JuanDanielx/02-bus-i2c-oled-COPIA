// ============================================================================
// APRENDIENDO ARDUINO: Ojos sencillos parpadeando
// ============================================================================

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET_PIN -1
#define OLED_I2C_ADDR 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET_PIN);

// ----------------------------------------------------------------------------
// FUNCIÓN MODULAR: Dibuja un ojo según su estado (abierto o cerrado)
// ----------------------------------------------------------------------------
void dibujarOjo(int x, int y, bool abierto)
{
    if (abierto)
    {
        // Dibuja un rectángulo grande (el ojo abierto) y un punto negro (la pupila)
        display.fillRect(x, y, 30, 20, SSD1306_WHITE); // Ojo blanco
        display.fillRect(x + 10, y + 5, 10, 10, SSD1306_BLACK); // Pupila negra
    }
    else
    {
        // Dibuja una simple línea horizontal (ojo cerrado)
        display.drawLine(x, y + 10, x + 30, y + 10, SSD1306_WHITE);
        display.drawLine(x, y + 11, x + 30, y + 11, SSD1306_WHITE); // Grosor de 2 píxeles
    }
}

// ----------------------------------------------------------------------------
// FUNCIÓN PARA MOSTRAR AMBOS OJOS
// ----------------------------------------------------------------------------
void mostrarOjos(bool abierto)
{
    display.clearDisplay(); // 1. Limpiamos la pantalla
    
    // Ojo Izquierdo en la posición X=25, Y=22
    dibujarOjo(25, 22, abierto);
    
    // Ojo Derecho en la posición X=73, Y=22
    dibujarOjo(73, 22, abierto);
    
    display.display();      // 2. Mandamos la imagen a la pantalla física
}

void setup()
{
    Serial.begin(115200);
    Wire.begin(21, 22);

    // Inicializar la pantalla OLED
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR))
    {
        Serial.println("Error: No se encuentra la pantalla OLED");
        while (true);
    }

    display.clearDisplay();
}

void loop()
{
    // 1. Ojos abiertos durante 2 segundos
    mostrarOjos(true);
    delay(2000);

    // 2. Parpadeo (ojos cerrados) durante 200 milisegundos
    mostrarOjos(false);
    delay(200);
}