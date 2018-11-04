#pragma once

#include <QtWidgets\QApplication>
#include <QtWidgets\QDeskTopWidget>
#include <QtWidgets\QMainWindow>
#include <QtWidgets\QMenuBar>
#include <QtWebEngineWidgets\QWebEngineView>
#include <QtCore\QRect>
#include <QtGui\QCursor>
#include <QtGui\QScreen>
#include <QtWidgets\QToolbar>
#include <QtWidgets\QPushButton>
#include <QtWidgets\QLabel>
#include <QtWidgets\QStatusBar>
#include <QtWidgets\QDialog>
#include <QtWidgets\QProgressBar>




#include "Utils.h"

#ifdef _DEBUG
#pragma comment(lib, "Qt5Widgetsd.lib")
#pragma comment(lib, "Qt5Cored.lib")
#pragma comment(lib, "Qt5Guid.lib")
#pragma comment(lib, "Qt5WebEngineWidgetsd.lib")
#else
#pragma comment(lib, "Qt5Widgets.lib")
#pragma comment(lib, "Qt5Core.lib")
#pragma comment(lib, "Qt5Gui.lib")
#pragma comment(lib, "Qt5WebEngineWidgets.lib")
#endif