#include "stdafx.h"
#include "DlgNavigate.h"
#include "GeneratedFiles/ui_DlgNavigate.h"  


DlgNavigate::DlgNavigate(QWidget * parent)
	: QDialog(parent)
	, ui(new Ui::DlgNavigate)
{
	ui->setupUi(this);
}

DlgNavigate::~DlgNavigate() {
	delete ui;
}

QString DlgNavigate::ShowNavigateDialog() {
	DlgNavigate dlg;
	int retVal = dlg.exec();
	if (retVal == 0) { return QString(); }
	return dlg.ui->comboBox->currentText();
}