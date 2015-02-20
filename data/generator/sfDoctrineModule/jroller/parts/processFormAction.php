  protected function processForm(sfWebRequest $request, sfForm $form)
  {
    $form->bind($request->getParameter($form->getName()), $request->getFiles($form->getName()));
    if ($form->isValid())
    {
      $notice = $form->getObject()->isNew() ? 'The item was created successfully.' : 'The item was updated successfully.';

      $<?php echo $this->getSingularName() ?> = $form->save();

      $this->dispatcher->notify(new sfEvent($this, 'admin.save_object', array('object' => $<?php echo $this->getSingularName() ?>)));

      switch(true) {
        case ($request->hasParameter('_save_and_add')):
          $notice .= ' You can add another one below.';
          $redirectRoute = '@<?php echo $this->getUrlForAction('new') ?>';
          break;

        case ($request->hasParameter('_save_and_back')):
          $redirectRoute = '@<?php echo $this->getUrlForAction('list') ?>';
          break;

        default:
          $redirectRoute = array('sf_route' => '<?php echo $this->getUrlForAction('edit') ?>', 'sf_subject' => $<?php echo $this->getSingularName() ?>);
      }

      $this->getUser()->setFlash('notice', $notice);
      $this->redirect($redirectRoute);
    }
    else
    {
      $this->getUser()->setFlash('error', 'The item has not been saved due to some errors.', false);
    }
  }
