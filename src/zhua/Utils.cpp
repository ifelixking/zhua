#include "stdafx.h"
#include "Utils.h"

QRect Utils::GetCenterStartup(const QSize & size) {
	if (!QApplication::screens().size()) { return QRect(); }
	auto screen = QApplication::screens()[(QApplication::desktop()->primaryScreen())];
	return QRect((screen->size().width() - size.width()) >> 1, (screen->size().height() - size.height()) >> 1, size.width(), size.height());
}