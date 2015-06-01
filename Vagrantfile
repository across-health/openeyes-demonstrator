# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end
  config.vm.provision :shell, path: "shell/provision.sh"

  config.vm.network :forwarded_port, host: 3090, guest: 3000
  config.vm.network :forwarded_port, host: 35729, guest: 35729 # LiveReload server
end
