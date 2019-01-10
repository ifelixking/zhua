#pragma once

#include <QtWidgets\QApplication>
#include <QtWidgets\QDeskTopWidget>
#include <QtWidgets\QMainWindow>
#include <QtWidgets\QMenuBar>
#include <QtWebEngineWidgets\QWebEngineView>
#include <QtWebEngineWidgets\QWebEngineProfile>
#include <QtCore\QRect>
#include <QtGui\QCursor>
#include <QtGui\QScreen>
#include <QtWidgets\QToolbar>
#include <QtWidgets\QPushButton>
#include <QtWidgets\QLabel>
#include <QtWidgets\QStatusBar>
#include <QtWidgets\QDialog>
#include <QtWidgets\QProgressBar>
#include <QtCore\QUuid>
#include <QtWebEngineCore/QWebEngineCookieStore>  
#include <QtNetwork/QNetworkCookie>  
#include <QtNetwork/QNetworkCookieJar>
#include <QtWebChannel/QWebChannel>


#include "Utils.h"

#ifdef _DEBUG
#pragma comment(lib, "Qt5Widgetsd.lib")
#pragma comment(lib, "Qt5Cored.lib")
#pragma comment(lib, "Qt5Guid.lib")
#pragma comment(lib, "Qt5WebEngineWidgetsd.lib")
#pragma comment(lib, "Qt5WebEngineCored.lib")
#pragma comment(lib, "Qt5Networkd.lib")
#pragma comment(lib, "Qt5WebChanneld.lib")
#else
#pragma comment(lib, "Qt5Widgets.lib")
#pragma comment(lib, "Qt5Core.lib")
#pragma comment(lib, "Qt5Gui.lib")
#pragma comment(lib, "Qt5WebEngineWidgets.lib")
#pragma comment(lib, "Qt5WebEngineCore.lib")
#pragma comment(lib, "Qt5Network.lib")
#pragma comment(lib, "Qt5WebChannel.lib")
#endif